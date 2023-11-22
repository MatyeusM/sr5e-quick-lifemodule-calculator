import skillGroups from './data/skillgroups.json';

export function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i += 1) {
      arrCopy[i] = cloneDeep(obj[i]);
    }
    return arrCopy;
  }

  const objCopy = {};
  Object.keys(obj).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        objCopy[key] = cloneDeep(obj[key]);
    }
  });


  return objCopy;
}

export function IsSkillGroup(name) {
  const skillGroupNames = Object.keys(skillGroups);
  return skillGroupNames.includes(name);
}

export function GetSkillGroup(skillName) {
  const skillGroupNames = Object.keys(skillGroups);

  for (let i = 0; i < skillGroupNames.length; i += 1) {
    const groupName = skillGroupNames[i];
    const skillsInGroup = skillGroups[groupName];
    
    if (skillsInGroup.includes(skillName)) {
      return groupName;
    }
  }

  return null;
}

export function GetSkillGroupSkills(groupName) {
  if (Object.prototype.hasOwnProperty.call(skillGroups, groupName)) {
    return skillGroups[groupName];
  }
  return [];
}
