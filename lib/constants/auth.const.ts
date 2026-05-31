export const AUTH_COOKIES = {
  TOKEN: 'cms_token',
  USER_ID: 'cms_user_id',
  USER_NAME: 'cms_user_name',
  USER_ROLE: 'cms_user_role',
} as const;

export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24;
