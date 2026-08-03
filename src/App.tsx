import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const SongsPage = lazy(() => import("@/pages/SongsPage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const SongPage = lazy(() => import("@/pages/SongPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const PlaylistsPage = lazy(() => import("@/pages/PlaylistsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const PresentationPage = lazy(() => import("@/pages/PresentationPage"));
const BibleReaderPage = lazy(() => import("@/pages/BibleReaderPage"));
const BiblePlaylistPage = lazy(() => import("@/pages/BiblePlaylistPage"));

const router = createBrowserRouter([{ path: "/presentar/:numero", element: <PresentationPage /> }, { path: "/", element: <AppLayout />, children: [
  { index: true, element: <HomePage /> },
  { path: "buscar", element: <SearchPage /> },
  { path: "cantos", element: <SongsPage /> },
  { path: "favoritos", element: <FavoritesPage /> },
  { path: "listas", element: <PlaylistsPage /> },
  { path: "canto/:numero", element: <SongPage /> },
  { path: "biblia/:book/:chapter", element: <BibleReaderPage /> },
  { path: "tema/:id", element: <BiblePlaylistPage /> },
  { path: "configuracion", element: <SettingsPage /> },
  { path: "*", element: <NotFoundPage /> }
]}]);

export default function App() {
  return <Suspense fallback={<div className="loading" role="status">Cargando…</div>}><RouterProvider router={router} /></Suspense>;
}
