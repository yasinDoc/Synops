import {
  getAllDefenseSchedules,
  getDefenseScheduleById,
  createDefenseSchedule,
  updateDefenseSchedule,
  assignBoardMembers
} from '../models/defenseModel.js';
import { triggerNotification } from '../models/notificationModel.js';
import { findThesisById } from '../models/thesisModel.js';
import { findUserById } from '../store/usersStore.js';

function enrichSchedule(schedule) {
  const thesis = findThesisById(schedule.thesisId);
  const boardMembers = (schedule.boardMemberIds || []).map((id) => {
    const user = findUserById(id);
    return user ? { id: user.id, name: user.name, email: user.email } : { id, name: `Faculty #${id}` };
  });

  return {
    ...schedule,
    thesisTitle: thesis ? thesis.title : `Thesis #${schedule.thesisId}`,
    studentName: thesis ? thesis.studentName : 'Unknown Student',
    boardMembers
  };
}

export function listDefenseSchedules(req, res) {
  const schedules = getAllDefenseSchedules().map(enrichSchedule);
  return res.json({ items: schedules });
}

export function getDefenseSchedule(req, res) {
  const { id } = req.params;
  const schedule = getDefenseScheduleById(id);

  if (!schedule) {
    return res.status(404).json({ message: 'Defense schedule not found' });
  }

  return res.json({ schedule: enrichSchedule(schedule) });
}

export function scheduleDefense(req, res) {
  const { thesisId, room, date, time, boardMemberIds, notes } = req.body;

  if (!thesisId || !room || !date || !time) {
    return res.status(400).json({ message: 'thesisId, room, date, and time are required' });
  }

  const schedule = createDefenseSchedule({
    thesisId,
    room,
    date,
    time,
    boardMemberIds,
    notes
  });

  // Trigger notification for student and board members
  triggerNotification({
    userId: 1, // Student ID
    message: `Defense scheduled for thesis #${thesisId} on ${date} at ${time} (Room: ${room})`,
    type: 'defense_scheduled'
  });

  return res.status(201).json({
    message: 'Defense schedule saved',
    schedule: enrichSchedule(schedule)
  });
}

export function editDefenseSchedule(req, res) {
  const { id } = req.params;
  const updated = updateDefenseSchedule(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: 'Defense schedule not found' });
  }

  return res.json({
    message: 'Defense schedule updated',
    schedule: enrichSchedule(updated)
  });
}

export function assignBoardMembersToDefense(req, res) {
  const { id } = req.params;
  const { boardMemberIds } = req.body;

  if (!Array.isArray(boardMemberIds)) {
    return res.status(400).json({ message: 'boardMemberIds must be an array' });
  }

  const updated = assignBoardMembers(id, boardMemberIds);

  if (!updated) {
    return res.status(404).json({ message: 'Defense schedule not found' });
  }

  return res.json({
    message: 'Board members assigned successfully',
    schedule: enrichSchedule(updated)
  });
}
