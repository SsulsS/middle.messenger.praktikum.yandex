import Handlebars from "handlebars";
import template from "./NotFound.hbs?raw";
import "./NotFound.scss";

const renderPage = Handlebars.compile(template);


const pathname = location.pathname;
let context: Record<string, string> = {
  errorCode: "404",
  title: "Страница не найдена",
  message: "К сожалению, запрашиваемая страница не существует или была перемещена.",
  homeUrl: "/",
  homeText: "Назад к чатам",
};

if (pathname === "/500") {
  context = {
    errorCode: "500",
    title: "Мы уже фиксируем",
    message: "Произошла внутренняя ошибка сервера. Попробуйте позже.",
    homeUrl: "/",
    homeText: "Назад к чатам",
  };
}

const pageHtml = renderPage(context);
const appDiv = document.querySelector<HTMLDivElement>("#app")!;
appDiv.innerHTML = pageHtml;
