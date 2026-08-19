import http from 'http';
import { createApp } from '../src/app.js';
import { resetDefenseSchedules } from '../src/models/defenseModel.js';
import { resetEvaluations } from '../src/models/evaluationModel.js';
import { resetNotifications } from '../src/models/notificationModel.js';

const app = createApp();
let server;
let baseUrl;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const postData = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (body) {
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: reqHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function run() {
  console.log('\n--- Running Synops Jishan Auth & Defense Integration Tests ---');
  resetDefenseSchedules();
  resetEvaluations();
  resetNotifications();

  await new Promise((res) => {
    server = app.listen(5099, () => {
      baseUrl = 'http://127.0.0.1:5099';
      res();
    });
  });

  try {
    // 1. Auth Login (Student, Faculty, Admin)
    const studentLogin = await request('POST', '/api/auth/login', {
      email: 'student@synops.local',
      password: 'student123'
    });
    assert(studentLogin.status === 200, 'Student login returns 200');
    assert(!!studentLogin.body.token, 'Student login returns token');
    const studentToken = studentLogin.body.token;

    const facultyLogin = await request('POST', '/api/auth/login', {
      email: 'faculty@synops.local',
      password: 'faculty123'
    });
    assert(facultyLogin.status === 200, 'Faculty login returns 200');
    const facultyToken = facultyLogin.body.token;

    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@synops.local',
      password: 'admin123'
    });
    assert(adminLogin.status === 200, 'Admin login returns 200');
    const adminToken = adminLogin.body.token;

    // 2. Auth /me
    const meRes = await request('GET', '/api/auth/me', null, {
      Authorization: `Bearer ${studentToken}`
    });
    assert(meRes.status === 200, 'GET /api/auth/me returns 200');
    assert(meRes.body.user.role === 'student', 'GET /api/auth/me returns role student');

    // 3. Defense Scheduling (Role Protected)
    const unauthorizedSched = await request('POST', '/api/defense', {
      thesisId: 1,
      room: 'B-101',
      date: '2026-09-15',
      time: '14:00'
    }, { Authorization: `Bearer ${studentToken}` });
    assert(unauthorizedSched.status === 403, 'Student cannot schedule defense (403)');

    const adminSched = await request('POST', '/api/defense', {
      thesisId: 2,
      room: 'Auditorium',
      date: '2026-09-20',
      time: '11:00',
      boardMemberIds: [2],
      notes: 'Final review'
    }, { Authorization: `Bearer ${adminToken}` });
    assert(adminSched.status === 201, 'Admin schedules defense (201)');
    assert(adminSched.body.schedule.room === 'Auditorium', 'Defense schedule room matches');

    // 4. Assign Board Members
    const assignBoard = await request('POST', `/api/defense/${adminSched.body.schedule.id}/assign-board`, {
      boardMemberIds: [2, 3]
    }, { Authorization: `Bearer ${adminToken}` });
    assert(assignBoard.status === 200, 'Admin assigns board members (200)');
    assert(assignBoard.body.schedule.boardMemberIds.length === 2, 'Board members updated to 2');

    // 5. Evaluation Submission & Auto Total Calculation
    const evalRes = await request('POST', '/api/evaluation', {
      defenseId: adminSched.body.schedule.id,
      boardMemberId: 2,
      reportMarks: 35,
      presentationMarks: 18,
      vivaMarks: 38,
      feedback: 'Excellent work!'
    }, { Authorization: `Bearer ${facultyToken}` });
    assert(evalRes.status === 201, 'Faculty submits evaluation (201)');
    assert(evalRes.body.evaluation.totalMarks === 91, 'Auto-calculated totalMarks is 91 (35+18+38)');

    // 6. Notifications Triggered
    const notifs = await request('GET', '/api/notifications/1');
    assert(notifs.status === 200, 'GET notifications returns 200');
    assert(notifs.body.items.length >= 2, 'Defense scheduling triggered notification for student');

  } catch (err) {
    console.error('Test error:', err);
    failed++;
  } finally {
    if (server) server.close();
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
