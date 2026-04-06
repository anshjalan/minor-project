const departmentMap = {
  Garbage: "Sanitation Department",
  Road: "Road Maintenance Department",
  Lighting: "Electrical Department",
  Water: "Water Supply Department",
  Drainage: "Drainage and Sewer Department",
  Other: "General Civic Department"
};

export function routeDepartment(category) {
  return departmentMap[category] || departmentMap.Other;
}

