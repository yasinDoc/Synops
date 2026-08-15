import {
  THESIS_STATUSES,
  assignSupervisor,
  createThesis,
  findThesisById,
  getAllTheses,
  updateThesisStatus
} from '../models/thesisModel.js';
import { findUserById } from '../store/usersStore.js';
import { searchThesesByTitleOrStudent } from '../services/repositoryService.js';

export function listTheses(_req, res) {
  const items = getAllTheses();
  return res.json({ items, count: items.length });
}

export function searchTheses(req, res) {
  const items = searchThesesByTitleOrStudent(getAllTheses(), req.query.q);
  return res.json({ items, count: items.length });
}

export function getThesisById(req, res) {
  const thesis = findThesisById(req.params.id);

  if (!thesis) {
    return res.status(404).json({ message: 'Thesis not found' });
  }

  return res.json({ thesis });
}

export function createThesisHandler(req, res) {
  const { title, abstract, studentName, supervisorName } = req.body;

  if (!title || !abstract || !studentName) {
    return res.status(400).json({ message: 'title, abstract, and studentName are required' });
  }

  const thesis = createThesis({ title, abstract, studentName, supervisorName });
  return res.status(201).json({ message: 'Thesis created successfully', thesis });
}

export function updateThesisStatusHandler(req, res) {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'status is required' });
  }

  if (!THESIS_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `invalid status. allowed: ${THESIS_STATUSES.join(', ')}`
    });
  }

  const thesis = updateThesisStatus(req.params.id, status);

  if (!thesis) {
    return res.status(404).json({ message: 'Thesis not found' });
  }

  return res.json({ message: 'Thesis status updated', thesis });
}

export function assignSupervisorHandler(req, res) {
  const { supervisorId } = req.body;

  if (!supervisorId) {
    return res.status(400).json({ message: 'supervisorId is required' });
  }

  const supervisorUser = findUserById(supervisorId);
  const supervisorName = supervisorUser ? supervisorUser.name : `Faculty #${supervisorId}`;

  const thesis = assignSupervisor(req.params.id, supervisorId, supervisorName);

  if (!thesis) {
    return res.status(404).json({ message: 'Thesis not found' });
  }

  return res.json({ message: 'Supervisor assigned successfully', thesis });
}