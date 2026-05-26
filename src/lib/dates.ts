export const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateTimeFormatter.format(d);
};

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
};

export const calculateAge = (iso: string): string => {
  const dob = new Date(iso);
  if (Number.isNaN(dob.getTime())) return "—";

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age < 0 ? "—" : `${age} ${age === 1 ? "year" : "years"}`;
};
