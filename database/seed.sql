-- Synops Seed Script
-- Inserts 3 test users (student, faculty, admin) and 2 sample theses

INSERT INTO Users (id, name, email, password_hash, role) VALUES
(1, 'Demo Student', 'student@synops.local', '$2b$10$e.g.student123hash', 'student'),
(2, 'Demo Faculty', 'faculty@synops.local', '$2b$10$e.g.faculty123hash', 'faculty'),
(3, 'Demo Admin', 'admin@synops.local', '$2b$10$e.g.admin123hash', 'admin');

INSERT INTO Thesis (id, title, abstract, student_id, supervisor_id, status) VALUES
(1, 'AI-Based Thesis Management System', 'A web-based platform designed to streamline thesis proposal submission, review, similarity checking, defense scheduling, and final grading.', 1, 2, 'under_review'),
(2, 'Distributed Ledger for Academic Document Verification', 'Investigating decentralized blockchain solutions for tamper-proof transcript and thesis verification across institutions.', 1, NULL, 'submitted');

INSERT INTO Submission (id, thesis_id, file_path, version_no, submitted_at) VALUES
(1, 1, '/uploads/demo-report-v1.pdf', 1, CURRENT_TIMESTAMP);

INSERT INTO SimilarityResult (id, submission_id, similarity_pct, matched_note) VALUES
(1, 1, 12.50, 'Matched standard bibliography template and common algorithm introductory phrases.');

INSERT INTO Comments (id, thesis_id, author_id, content) VALUES
(1, 1, 2, 'The methodology section looks strong. Please clarify the experimental setup in section 3.2.');

INSERT INTO DefenseSchedule (id, thesis_id, room, date, time) VALUES
(1, 1, 'Auditorium A-204', '2026-09-10', '10:00 AM');

INSERT INTO BoardMembers (id, defense_id, faculty_id) VALUES
(1, 1, 2);

INSERT INTO Notifications (id, user_id, message, is_read) VALUES
(1, 1, 'Your thesis "AI-Based Thesis Management System" has been assigned to supervisor Demo Faculty.', FALSE),
(2, 2, 'You have been assigned as supervisor for thesis "AI-Based Thesis Management System".', FALSE);
