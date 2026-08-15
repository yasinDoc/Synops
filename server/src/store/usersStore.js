export const users = [
  {
    id: 1,
    name: 'Demo Student',
    email: 'student@synops.local',
    password: 'student123',
    role: 'student'
  },
  {
    id: 2,
    name: 'Demo Faculty',
    email: 'faculty@synops.local',
    password: 'faculty123',
    role: 'faculty'
  },
  {
    id: 3,
    name: 'Demo Admin',
    email: 'admin@synops.local',
    password: 'admin123',
    role: 'admin'
  }
];

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

export function findUserById(id) {
  return users.find((user) => user.id === Number(id));
}