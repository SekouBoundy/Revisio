// constants/ScheduleData.js
export const scheduleData = {
  DEF: {
    1: [ // Lundi
      { time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Cours', color: '#2196F3' },
      { time: '09:00-10:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: '#FF9800' },
      { time: '10:15-11:15', subject: 'Histoire-Géographie', teacher: 'M. Bernard', room: 'Salle 15', type: 'Cours', color: '#9C27B0' },
      { time: '11:15-12:15', subject: 'Anglais', teacher: 'Mme Smith', room: 'Salle 20', type: 'Cours', color: '#607D8B' },
      { time: '14:00-15:00', subject: 'Sciences de la Vie et de la Terre', teacher: 'M. Laurent', room: 'Lab 1', type: 'TP', color: '#4CAF50' },
      { time: '15:00-16:00', subject: 'Physique-Chimie', teacher: 'Mme Durand', room: 'Lab 2', type: 'TP', color: '#E91E63' }
    ],
    2: [ // Mardi
      { time: '08:00-09:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: '#FF9800' },
      { time: '09:00-10:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Exercices', color: '#2196F3' },
      { time: '10:15-11:15', subject: 'Éducation Civique et Morale', teacher: 'M. Moreau', room: 'Salle 18', type: 'Cours', color: '#795548' },
      { time: '11:15-12:15', subject: 'Langue Arabe', teacher: 'M. Ahmed', room: 'Salle 25', type: 'Cours', color: '#FF5722' },
      { time: '14:00-15:00', subject: 'Anglais', teacher: 'Mme Smith', room: 'Salle 20', type: 'Oral', color: '#607D8B' }
    ],
    3: [ // Mercredi
      { time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Contrôle', color: '#2196F3' },
      { time: '09:00-10:00', subject: 'Sciences de la Vie et de la Terre', teacher: 'M. Laurent', room: 'Salle 5', type: 'Cours', color: '#4CAF50' },
      { time: '10:15-11:15', subject: 'Physique-Chimie', teacher: 'Mme Durand', room: 'Lab 2', type: 'Cours', color: '#E91E63' }
    ],
    4: [ // Jeudi
      { time: '08:00-09:00', subject: 'Histoire-Géographie', teacher: 'M. Bernard', room: 'Salle 15', type: 'Cours', color: '#9C27B0' },
      { time: '09:00-10:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Dictée', color: '#FF9800' },
      { time: '10:15-11:15', subject: 'Langue Arabe', teacher: 'M. Ahmed', room: 'Salle 25', type: 'Cours', color: '#FF5722' },
      { time: '14:00-15:00', subject: 'Éducation Civique et Morale', teacher: 'M. Moreau', room: 'Salle 18', type: 'Débat', color: '#795548' }
    ],
    5: [ // Vendredi
      { time: '08:00-09:00', subject: 'Anglais', teacher: 'Mme Smith', room: 'Salle 20', type: 'Test', color: '#607D8B' },
      { time: '09:00-10:00', subject: 'Sciences de la Vie et de la Terre', teacher: 'M. Laurent', room: 'Lab 1', type: 'Quiz', color: '#4CAF50' },
      { time: '10:15-11:15', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Révisions', color: '#2196F3' }
    ]
  },

  TSE: {
    1: [ // Lundi
      { time: '08:00-10:00', subject: 'Mathématiques', teacher: 'Prof. Leroy', room: 'Amphi A', type: 'Cours', color: '#2196F3' },
      { time: '10:15-12:15', subject: 'Physique', teacher: 'Dr. Rousseau', room: 'Lab Physique', type: 'TP', color: '#E91E63' },
      { time: '14:00-16:00', subject: 'Chimie', teacher: 'Prof. Blanc', room: 'Lab Chimie', type: 'TP', color: '#9C27B0' },
      { time: '16:15-17:15', subject: 'Philosophie', teacher: 'Prof. Mercier', room: 'Salle 101', type: 'Cours', color: '#795548' }
    ],
    2: [ // Mardi
      { time: '08:00-10:00', subject: 'Informatique', teacher: 'M. Garcia', room: 'Salle Info', type: 'TP', color: '#607D8B' },
      { time: '10:15-12:15', subject: 'Sciences de la Vie et de la Terre', teacher: 'Dr. Petit', room: 'Lab Bio', type: 'TP', color: '#4CAF50' },
      { time: '14:00-15:00', subject: 'Français', teacher: 'Prof. Roux', room: 'Salle 205', type: 'Cours', color: '#FF9800' },
      { time: '15:15-16:15', subject: 'Anglais', teacher: 'Mrs. Johnson', room: 'Salle 210', type: 'Oral', color: '#3F51B5' }
    ],
    3: [ // Mercredi
      { time: '08:00-10:00', subject: 'Mathématiques', teacher: 'Prof. Leroy', room: 'Amphi A', type: 'TD', color: '#2196F3' },
      { time: '10:15-12:15', subject: 'Physique', teacher: 'Dr. Rousseau', room: 'Amphi B', type: 'Cours', color: '#E91E63' }
    ],
    4: [ // Jeudi
      { time: '08:00-10:00', subject: 'Chimie', teacher: 'Prof. Blanc', room: 'Amphi C', type: 'Cours', color: '#9C27B0' },
      { time: '10:15-12:15', subject: 'Informatique', teacher: 'M. Garcia', room: 'Salle Info', type: 'Projet', color: '#607D8B' },
      { time: '14:00-16:00', subject: 'Sciences de la Vie et de la Terre', teacher: 'Dr. Petit', room: 'Salle 301', type: 'Cours', color: '#4CAF50' }
    ],
    5: [ // Vendredi
      { time: '08:00-10:00', subject: 'Mathématiques', teacher: 'Prof. Leroy', room: 'Salle Examen', type: 'Examen', color: '#2196F3' },
      { time: '14:00-15:00', subject: 'Philosophie', teacher: 'Prof. Mercier', room: 'Salle 101', type: 'Dissertation', color: '#795548' }
    ]
  }
};

export const upcomingExams = {
  DEF: [
    { date: 'Demain', subject: 'Contrôle de Maths', type: 'Contrôle', color: '#2196F3' },
    { date: 'Vendredi', subject: 'Quiz Sciences', type: 'Quiz', color: '#4CAF50' },
    { date: 'Lundi prochain', subject: 'Dictée Français', type: 'Évaluation', color: '#FF9800' }
  ],
  BAC: [
    { date: '25 Mai', subject: 'Dissertation Philosophie', type: 'Examen', color: '#795548' },
    { date: '27 Mai', subject: 'Mathématiques', type: 'Examen Blanc', color: '#2196F3' },
    { date: '30 Mai', subject: 'Physique-Chimie', type: 'TP Évalué', color: '#E91E63' }
  ]
};