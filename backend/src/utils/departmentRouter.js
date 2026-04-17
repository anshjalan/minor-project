const departmentMap = {
  "Damaged Concrete Structures": "Structural Maintenance Department",
  "Damaged Electric Poles": "Electrical Department",
  "Damaged Road Signs": "Traffic and Transport Department",
  "Dead Animal Pollution": "Sanitation Department",
  "Fallen Trees": "Parks and Forestry Department",
  "Garbage": "Sanitation Department",
  "Graffiti": "Public Works Department",
  "Pothole": "Road Maintenance Department",
  "Road Crack": "Road Maintenance Department",
  "Other": "General Civic Department"
};

export function routeDepartment(category) {
  return departmentMap[category] || departmentMap.Other;
}

