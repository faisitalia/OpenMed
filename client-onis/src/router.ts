import { createRouter, createWebHistory } from "vue-router";

import { useAuth } from "./composables/useAuth";
import { useUser } from "./composables/useUser";

import HomePage from "@/pages/home/HomePage.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import UsersPageVue from "@/pages/users/UsersPage.vue";
import SurveysPage from "./pages/surveys/SurveysPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { layout: "OpenmedLayout" },
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/users",
      name: "users",
      component: UsersPageVue,
      meta: { layout: "OpenmedLayout" },
    },
    {
      path: "/surveys",
      name: "surveys",
      component: SurveysPage,
      meta: { layout: "OpenmedLayout" },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const publicPages = ["/login", "/about", "/signup"];
  const authenticationRequired = !publicPages.includes(to.path);

  const { isAuthenticated } = useAuth();

  if (authenticationRequired && !isAuthenticated) return "/login";

  const { isDoctor, isPatient, isAdmin } = useUser();

  const adminPages = ["/users"];
  const adminRequired = adminPages.includes(to.path);
  if (adminRequired && !isAdmin) return from.path;

  const patientPages = ["/appointments"];
  const patientRequired = patientPages.includes(to.path);
  if (patientRequired && !isPatient) return from.path;

  const doctorPages = [
    "/appointments",
    "/appointments/edit",
    "/appointments/ok",
  ];
  const doctorRequired = doctorPages.includes(to.path);
  if (doctorRequired && !isDoctor) return from.path;
});

export default router;