-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 22-11-2023 a las 21:53:57
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `UCM_RIU`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `UCM_AW_RIU_INS_Instalaciones`
--

CREATE TABLE `UCM_AW_RIU_INS_Instalaciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `aforo` int(11) NOT NULL,
  `tipoReserva` varchar(40) NOT NULL,
  `imagen` blob NOT NULL,
  `disponibilidad` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `UCM_AW_RIU_MEN_Mensajes`
--

CREATE TABLE `UCM_AW_RIU_MEN_Mensajes` (
  `id` int(11) NOT NULL,
  `id_origen` int(11) NOT NULL,
  `id_dest` int(11) NOT NULL,
  `contenido` varchar(255) NOT NULL,
  `asunto` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `UCM_AW_RIU_RES_Reservas`
--

CREATE TABLE `UCM_AW_RIU_RES_Reservas` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_instalacion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `UCM_AW_RIU_USU_Usuarios`
--

CREATE TABLE `UCM_AW_RIU_USU_Usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `apellidos` varchar(40) NOT NULL,
  `facultad` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `curso` int(10) NOT NULL,
  `grupo` varchar(10) NOT NULL,
  `foto` blob DEFAULT NULL,
  `rol` varchar(20) NOT NULL,
  `validado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `UCM_AW_RIU_INS_Instalaciones`
--
ALTER TABLE `UCM_AW_RIU_INS_Instalaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `UCM_AW_RIU_MEN_Mensajes`
--
ALTER TABLE `UCM_AW_RIU_MEN_Mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CONSTRAINT_ORI` (`id_origen`),
  ADD KEY `CONSTRAINT_DEST` (`id_dest`);

--
-- Indices de la tabla `UCM_AW_RIU_RES_Reservas`
--
ALTER TABLE `UCM_AW_RIU_RES_Reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CONSTRAINT_USU` (`id_usuario`),
  ADD KEY `CONSTRAINT_INS` (`id_instalacion`);

--
-- Indices de la tabla `UCM_AW_RIU_USU_Usuarios`
--
ALTER TABLE `UCM_AW_RIU_USU_Usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQUE_EMAIL` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `UCM_AW_RIU_INS_Instalaciones`
--
ALTER TABLE `UCM_AW_RIU_INS_Instalaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `UCM_AW_RIU_MEN_Mensajes`
--
ALTER TABLE `UCM_AW_RIU_MEN_Mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `UCM_AW_RIU_RES_Reservas`
--
ALTER TABLE `UCM_AW_RIU_RES_Reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `UCM_AW_RIU_USU_Usuarios`
--
ALTER TABLE `UCM_AW_RIU_USU_Usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `UCM_AW_RIU_MEN_Mensajes`
--
ALTER TABLE `UCM_AW_RIU_MEN_Mensajes`
  ADD CONSTRAINT `CONSTRAINT_DEST` FOREIGN KEY (`id_dest`) REFERENCES `UCM_AW_RIU_USU_Usuarios` (`id`),
  ADD CONSTRAINT `CONSTRAINT_ORI` FOREIGN KEY (`id_origen`) REFERENCES `UCM_AW_RIU_USU_Usuarios` (`id`);

--
-- Filtros para la tabla `UCM_AW_RIU_RES_Reservas`
--
ALTER TABLE `UCM_AW_RIU_RES_Reservas`
  ADD CONSTRAINT `CONSTRAINT_INS` FOREIGN KEY (`id_instalacion`) REFERENCES `UCM_AW_RIU_INS_Instalaciones` (`id`),
  ADD CONSTRAINT `CONSTRAINT_USU` FOREIGN KEY (`id_usuario`) REFERENCES `UCM_AW_RIU_USU_Usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
