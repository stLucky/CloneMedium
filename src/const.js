const STORAGE_USER_KEY = "user";
const STORAGE_CLAPS_KEY = "claps";
const STORAGE_EDIT_POST_KEY = "edit";
const COUNT_DELETED__ELEMENTS = 1;
const VISIBLE_POSTS_ON_PAGE = 10;
const NUMBER_SEC_IN_DAY = 86400000;

const Errors = {
  NON_EXISTING_USER: "Такого пользователя не существует",
  NON_EXISTING_PAGE: "Запрашиваемая страница не найдена",

  INVALID_PASSWORD: "Неверный пароль",
  OTHER: "Упс... Что-то пошло не так!",
};

const PostsErrors = {
  NON_DELETED_POST: "Не удалось удалить пост, пожалуйста попробуйте еще раз",
};

const Users = {
  WRITER: "writer",
  READER: "reader",
};

export {
  STORAGE_USER_KEY,
  STORAGE_CLAPS_KEY,
  STORAGE_EDIT_POST_KEY,
  COUNT_DELETED__ELEMENTS,
  VISIBLE_POSTS_ON_PAGE,
  NUMBER_SEC_IN_DAY,
  Errors,
  PostsErrors,
  Users,
};
