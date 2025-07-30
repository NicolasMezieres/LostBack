export type category = {
  name: string;
};
export type queryCategory = {
  search: string;
};
export type queryUser = {
  page: string;
  search: string;
};
export type queryAnnouncementAdmin = {
  search: string | undefined;
  isLost: string | undefined;
  fromDate: string;
  toDate: string;
  page: string;
};
