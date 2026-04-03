const mockUsers = [
  {
    id: 1,
    email: 'student@concordia.ca',
    password: 'soen357',
    firstName: 'Maya',
    lastName: 'McDonald',
    savedApartmentIds: [2, 4],
    compareApartmentIds: [2, 4],
    preferences: {
      maxBudget: 1200,
      maxCommute: 20,
      budgetWeight: 5,
      commuteWeight: 4,
      safetyWeight: 5,
      socialWeight: 2,
      quietWeight: 4,
      furnishedOnly: false,
      utilitiesIncludedOnly: false,
    },
  },
];

export default mockUsers;
