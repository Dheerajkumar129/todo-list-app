/*Helper to generate initial demo tasks dynamically around the current week*/

function getInitialSeedTasks() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  // Monday of this week at 00:00
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + diffToMonday);
  thisMonday.setHours(9, 0, 0, 0);

  // Helper to add days and set hour
  const makeDate = (base, daysToAdd, hour = 10, minute = 0) => {
    const d = new Date(base);
    d.setDate(base.getDate() + daysToAdd);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  return [
    // Previous Week (-7 days)
    {
      _id: 'seed-task-1',
      title: 'Design Review & Feedback Sync',
      description: 'Review Figma wireframes with the UI/UX team and finalize component specs',
      dateTime: makeDate(thisMonday, -4, 11, 0).toISOString(),
      priority: 'High',
      status: 'Completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'seed-task-2',
      title: 'Database Schema Migration',
      description: 'Prepare Mongoose models and indexes for task scheduling',
      dateTime: makeDate(thisMonday, -2, 14, 30).toISOString(),
      priority: 'Medium',
      status: 'Completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Current Week (Monday - Sunday)
    {
      _id: 'seed-task-3',
      title: 'Implement Weekly Task Grouping',
      description: 'Group tasks by Monday-Sunday calendar weeks with open and completed counters',
      dateTime: makeDate(thisMonday, 0, 10, 0).toISOString(),
      priority: 'High',
      status: 'Completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'seed-task-4',
      title: 'Swipe Left to Delete Task Gesture',
      description: 'Add smooth touch swipe gesture on task items to reveal delete action button',
      dateTime: makeDate(thisMonday, 1, 15, 0).toISOString(),
      priority: 'High',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'seed-task-5',
      title: 'Real-time Keyword Search',
      description: 'Filter tasks instantly by title and description keywords with modal view',
      dateTime: makeDate(thisMonday, 2, 16, 30).toISOString(),
      priority: 'Medium',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'seed-task-6',
      title: 'Team Retrospective & Demo',
      description: 'Weekly sprint retrospective and product walkthrough with stakeholders',
      dateTime: makeDate(thisMonday, 4, 17, 0).toISOString(),
      priority: 'Low',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Next Week (+7 days)
    {
      _id: 'seed-task-7',
      title: 'Deploy to Cloud & Configure Netlify',
      description: 'Set up continuous deployment pipeline on Netlify with backend API connection',
      dateTime: makeDate(thisMonday, 7, 10, 0).toISOString(),
      priority: 'High',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'seed-task-8',
      title: 'End-to-End User Testing',
      description: 'Test mobile touch responsiveness and CRUD workflows on real devices',
      dateTime: makeDate(thisMonday, 9, 14, 0).toISOString(),
      priority: 'Medium',
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

module.exports = {
  getInitialSeedTasks
};
