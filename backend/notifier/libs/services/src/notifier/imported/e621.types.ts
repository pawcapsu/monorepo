//
// Imported from
// https://github.com/DonovanDMC/E621/blob/master/src/index.ts
//
export class APIError extends Error {
  code: number;
  errmessage: string;
  method: string;
  endpoint: string;
  constructor(code: number, message: string, method: string, endpoint: string) {
    super(`Unexpected ${code} ${message} on ${method} ${endpoint}`);
    this.name = "APIError";
    this.code = code;
    this.errmessage = message;
    this.method = method;
    this.endpoint = endpoint;
    switch (code) {
      case 400:
        this.name = "APIError[BadRequest]";
        break;
      case 401:
        this.name = "APIError[Unauthorized]";
        break;
      case 403:
        this.name = "APIError[Forbidden]";
        break;
      case 404:
        this.name = "APIError[NotFound]";
        break;
      case 429:
        this.name = "APIError[RateLimited]";
        break;
    }
  }
}

export interface Post {
  id: number;
  created_at: string;
  updated_at: string;
  file: {
    width: number;
    height: number;
    ext: string;
    md5: string;
    url: string;
  };
  preview: {
    width: number;
    height: number;
    url: string;
  };
  sample: {
    has: boolean;
    height: number;
    width: number;
    url: string;
    alternates: Record<string, unknown>; // @TODO
  };
  score: {
    up: number;
    down: number;
    total: number;
  };
  tags: Record<
    | "general"
    | "species"
    | "character"
    | "copyright"
    | "artist"
    | "invalid"
    | "lore"
    | "meta",
    Array<string>
  >;
  locked_tags: Array<string>;
  change_seq: number;
  flags: Record<
    | "pending"
    | "flagged"
    | "note_locked"
    | "status_locked"
    | "rating_locked"
    | "deleted",
    boolean
  >;
  rating: "s" | "q" | "e";
  fav_count: number;
  sources: Array<string>;
  pools: Array<number>;
  relationships: {
    parent_id: number | null;
    has_children: boolean;
    has_active_children: boolean;
    children: Array<number>;
  };
  approver_id: number | null;
  uploader_id: number | null;
  description: string;
  comment_count: number;
  is_favorited: boolean;
  has_notes: boolean;
  duration: number | null;
}

export interface NullableURLPost {
  id: number;
  created_at: string;
  updated_at: string;
  file: {
    width: number;
    height: number;
    ext: string;
    md5: string;
    url: string | null;
  };
  preview: {
    width: number;
    height: number;
    url: string | null;
  };
  sample: {
    has: boolean;
    height: number;
    width: number;
    url: string | null;
    alternates: Record<string, unknown>; // @TODO
  };
  score: {
    up: number;
    down: number;
    total: number;
  };
  tags: Record<
    | "general"
    | "species"
    | "character"
    | "copyright"
    | "artist"
    | "invalid"
    | "lore"
    | "meta",
    Array<string>
  >;
  locked_tags: Array<string>;
  change_seq: number;
  flags: Record<
    | "pending"
    | "flagged"
    | "note_locked"
    | "status_locked"
    | "rating_locked"
    | "deleted",
    boolean
  >;
  rating: "s" | "q" | "e";
  fav_count: number;
  sources: Array<string>;
  pools: Array<number>;
  relationships: {
    parent_id: number | null;
    has_children: boolean;
    has_active_children: boolean;
    children: Array<number>;
  };
  approver_id: number | null;
  uploader_id: number | null;
  description: string;
  comment_count: number;
  is_favorited: boolean;
  has_notes: boolean;
  duration: number | null;
}

export interface UploadLimit {
  id: number;
  created_at: number;
  name: string;
  level: number;
  base_upload_limit: number;
  post_upload_count: number;
  post_update_count: number;
  note_update_count: number;
  is_banned: boolean;
  can_approve_posts: boolean;
  can_upload_free: boolean;
  level_string: string;
  avatar_id: number;
  show_avatars: boolean;
  blacklist_avatars: boolean;
  blacklist_users: boolean;
  description_collapsed_initially: boolean;
  hide_comments: boolean;
  show_hidden_comments: boolean;
  show_post_statistics: boolean;
  has_mail: boolean;
  receive_email_notifications: boolean;
  enable_keyboard_navigation: boolean;
  enable_privacy_mode: boolean;
  style_usernames: boolean;
  enable_auto_complete: boolean;
  has_saved_searches: boolean;
  disable_cropped_thumbnails: boolean;
  disable_mobile_gestures: boolean;
  enable_safe_mode: boolean;
  disable_responsive_mode: boolean;
  disable_post_tooltips: boolean;
  no_flagging: boolean;
  no_feedback: boolean;
  disable_user_dmails: boolean;
  enable_compact_uploader: boolean;
  updated_at: string;
  email: string;
  last_logged_in_at: string;
  last_forum_read_at: string;
  recent_tags: string;
  comment_threshold: number;
  default_image_size: string;
  favorite_tags: string;
  blacklisted_tags: string;
  time_zone: string;
  per_page: number;
  custom_style: string;
  favorite_count: number;
  api_regen_multiplier: number;
  api_burst_limit: number;
  remaining_api_limit: number;
  statement_timeout: number;
  favorite_limit: number;
  tag_query_limit: number;
}
