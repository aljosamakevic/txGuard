export const tenderly = {
  account: "Aljosa",
  project: "project",
  accessKey: import.meta.env.VITE_TENDERLY_ACCESS_KEY,
  get baseApiUrl() {
    return `https://api.tenderly.co/api/v1/account/${this.account}/project/${this.project}`;
  },
};
