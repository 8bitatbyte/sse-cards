function not(a: string[], b: string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: string[], b: string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: string[], b: string[]) {
  return [...a, ...not(b, a)];
}

function numberOfChecked(items: string[], checked: string[]) {
    return intersection(checked, items).length;
}

export { not, intersection, union, numberOfChecked };
