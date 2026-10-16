"use client";

import { PremiumFolderScrollScene } from "./premium-folder";

/**
 * Sección independiente con pin por scroll: el texto + folder quedan fijos
 * en el viewport mientras el scroll maneja hover → despliegue → guardado.
 * Va debajo del hero de animated-grid.
 */
export default function FolderShowcase() {
  return (
        <PremiumFolderScrollScene />
  );
}
