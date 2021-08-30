const COUNT_DELETED__ELEMENTS = 1;
const VISIBLE_POSTS_ON_PAGE = 10;
const NUMBER_SEC_IN_DAY = 86400000;

const BASE_URL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/";

const Storage = {
  USER: "user",
  CLAPS: "claps",
  ENTERED_DATA: "entered_data",
  EDIT_POST: "edit_post",
  PAGE: "page",
};

const Errors = {
  NON_EXISTING_USER: "Такого пользователя не существует",
  NON_EXISTING_PAGE: "Запрашиваемая страница не найдена",

  INVALID_PASSWORD: "Неверный пароль",
  OTHER: "Упс... Что-то пошло не так!",
};

const PostsErrors = {
  NON_DELETED_POST: "Не удалось удалить пост, пожалуйста попробуйте еще раз",
  NON_CREATED_POST: "Не удалось добавить пост, попробуйте в другой раз",
  NON_UPDATED_POST: "Не удалось обновить пост, попробуйте в другой раз",
  NON_UPDATED_LIKE: "Лайк не ставится, попробуйте в другой раз",
};

const Users = {
  WRITER: "writer",
  READER: "reader",
};

export {
  COUNT_DELETED__ELEMENTS,
  VISIBLE_POSTS_ON_PAGE,
  NUMBER_SEC_IN_DAY,
  BASE_URL,
  Storage,
  Errors,
  PostsErrors,
  Users,
};
