import { Theme } from "./theme.js";

export class UserSetting {
  private accountId: number;
  private theme: Theme;

  constructor(accountId: number, theme: Theme) {
    this.accountId = accountId;
    this.theme = theme;
  }
}
