-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 29-11-2023 a las 11:34:21
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

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('kY2RWMvW9UYfPbMm4xw9yvDsI1NYDHnH', 1701192066, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"correo\":\"samuelap@ucm.es\",\"id\":3}}');

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
  `foto` blob NOT NULL,
  `rol` varchar(20) NOT NULL,
  `validado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `UCM_AW_RIU_USU_Usuarios`
--

INSERT INTO `UCM_AW_RIU_USU_Usuarios` (`id`, `nombre`, `apellidos`, `facultad`, `email`, `contraseña`, `curso`, `grupo`, `foto`, `rol`, `validado`) VALUES
(3, 'samuel', 'parra', 'Ciencias Físicas', 'samuelap@ucm.es', '$2b$11$7FexTFxs34ZrCIRXgzZSOuWRkbt54fHyev44Zbn5gjS8zA37uJt0u', 4, 'C', 0x89504e470d0a1a0a0000000d49484452000000870000008708030000000b39ba3800000030504c5445e4e6e7aeb4b7aab1b4d1d5d7e7e9eae1e3e4b7bcbfb1b7baeaecedc8cccedcdfe0c1c6c8bfc3c6d8dbdda6adb0ccd0d2367cdedc0000031a49444154789ced9ad972eb200c4059c4620cf8fffff64252b7499bd81241243397f398979c91c46209212693c96432994c2693c964f27f0217deac60d2b6ac31c64527f326191061b14eed4867b5196f025edbf2e7772819831faca1e52f892bd986813101631f5ad498a8659886d74f24ae26765099c0fa2c187b72d21091338d1212cd2f721a8d31221ea35152c3bc6c40a334a47486d5c3e02ceaaae10c0858ac87541b9f086cc8ac5c44f832e3091a52ad5c018185e2215560f2108ea22155e409087acd7ec3532184c5f215908dc5231035a4b42cb722725a64e6281088640f96e3ce532d98b610c87491d85f4324725acaa9db5f83be7b54faef20a4336e87e1ac231e2e5f1efd8f98e9f1a11e9f52a72deb96e3d66e1af653db5f43f80fd9d73ded5658510bc739475f303c3765fa41a778ba54d4c4305dd8919ffa371e8943839e1886dbc715da8703db973624d216c2160ee19fb62b4786a3102815c2d85a26ec657c5ffb17b0a5ca99950af2d4551c27ed1d09a5e1d81bb998fb9062ee5a5e454e7791a231a2c10ec11d8684b7757a2b620e5b103c5da0c726dbef99d84f4e460ea404c0f26830a6ac1e3ca02bc9d9ec9d4a89904de20db35380b04595739d9ae6eca27ed704b7aa7830a960bc7f97441da61b6176f69fc62a7811b62546eb5c2d8c5a26cedab82e97c00c72307ab197aaf8bb5c6aa1d85507c1bb6a4ad8d35a67fa47db695d382e26c3b674c0a7f5cce147465acd512d65912e58875d25c7d459a5e4c33e7e58709221bbf54c8f4f948bfabd8adb7ac504926b687ddc04a54b4c20d0e70cbf4deceb0f0ffcd3139e64b2be1692b3ab175ee4a5ef88b6defe1393b55983dcf03816b1ad97f84e39f9a6e99d4cb7d2b8a5615e6718341a068786c1a290892286deb4c5a1483502cde7c9398455e35fdeca8f4007a4e7f6f517fc86867e8cd42882ac55f2fb0a32a812e1cd4a0537f66f784f40252302c21f8e026610c15e1d12d55c6d79d640f7381d98411ca0819801b01d2cf79c8e88506dda0e1e274bb7698adfc47147c08f582d957c9c9696a175132705d232c46ff338fe9e49590de2b850831e05d36c7732994c26935bfe01ca2123ec0fb00f8a0000000049454e44ae426082, 'usuario', 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
