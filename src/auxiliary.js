import skillGroups from './data/skillgroups.json';

export function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = cloneDeep(obj[i]);
    }
    return arrCopy;
  }

  const objCopy = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objCopy[key] = cloneDeep(obj[key]);
    }
  }

  return objCopy;
}

export function IsSkillGroup(name) {
  const skillGroupNames = Object.keys(skillGroups);
  return skillGroupNames.includes(name);
}
