CREATE TABLE `imones` (
  `pavadinimas` varchar(255) DEFAULT NULL,
  `miestas` varchar(255) DEFAULT NULL,
  `pasto_kodas` varchar(255) DEFAULT NULL,
  `adresas` varchar(255) DEFAULT NULL,
  `pastato_nr` varchar(255) DEFAULT NULL,
  `tel_nr` varchar(255) DEFAULT NULL,
  `imones_kodas` varchar(255) DEFAULT NULL,
  `pvm_kodas` varchar(255) DEFAULT NULL,
  `svetaine` varchar(255) DEFAULT NULL,
  `id_Imone` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Vartotojasid_Vartotojas` int(11) NOT NULL,
  PRIMARY KEY (`id_Imone`),
  UNIQUE KEY `fk_Vartotojasid_Vartotojas` (`fk_Vartotojasid_Vartotojas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `megstamiausi` (
  `id_Megstamas` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Skelbimasid_Skelbimas` int(11) NOT NULL,
  `fk_Vartotojasid_Vartotojas` int(11) NOT NULL,
  PRIMARY KEY (`id_Megstamas`),
  KEY `fk_Skelbimasid_Skelbimas` (`fk_Skelbimasid_Skelbimas`),
  KEY `fk_Vartotojasid_Vartotojas` (`fk_Vartotojasid_Vartotojas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `modeliai` (
  `pavadinimas` varchar(255) DEFAULT NULL,
  `aprasymas` varchar(255) DEFAULT NULL,
  `informacija` varchar(255) DEFAULT NULL,
  `sukurta` date DEFAULT NULL,
  `redaguota` date DEFAULT NULL,
  `id_Modelis` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Vartotojasid_Vartotojas` int(11) NOT NULL,
  PRIMARY KEY (`id_Modelis`),
  KEY `fk_Vartotojasid_Vartotojas` (`fk_Vartotojasid_Vartotojas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `nuotraukos` (
  `ref` blob DEFAULT NULL,
  `id_Nuotrauka` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Skelbimasid_Skelbimas` int(11) NOT NULL,
  PRIMARY KEY (`id_Nuotrauka`),
  KEY `fk_Skelbimasid_Skelbimas` (`fk_Skelbimasid_Skelbimas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `pokalbiai` (
  `id_Pokalbis` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Vartotojasid_Vartotojas1` int(11) NOT NULL,
  `fk_Vartotojasid_Vartotojas2` int(11) NOT NULL,
  `fk_Skelbimasid_Skelbimas` int(11) NOT NULL,
  PRIMARY KEY (`id_Pokalbis`),
  KEY `fk_Vartotojasid_Vartotojas1` (`fk_Vartotojasid_Vartotojas1`),
  KEY `fk_Vartotojasid_Vartotojas2` (`fk_Vartotojasid_Vartotojas2`),
  KEY `fk_Skelbimasid_Skelbimas` (`fk_Skelbimasid_Skelbimas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `skelbimai` (
  `pavadinimas` varchar(255) NOT NULL,
  `aprasymas` text DEFAULT NULL,
  `kaina` decimal(10,2) DEFAULT NULL,
  `min_kiekis` int(11) DEFAULT NULL,
  `vieta` varchar(255) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `amzius` int(11) DEFAULT NULL,
  `aukstis` int(11) DEFAULT NULL,
  `plotis` int(11) DEFAULT NULL,
  `lotyniskas_pav` varchar(255) DEFAULT NULL,
  `tipas` varchar(255) DEFAULT NULL,
  `kilme` varchar(255) DEFAULT NULL,
  `atstumas` int(11) DEFAULT NULL,
  `pristatymo_budas` char(16) DEFAULT NULL,
  `statusas` char(9) DEFAULT NULL,
  `id_Skelbimas` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Imoneid_Imone` int(11) NOT NULL,
  PRIMARY KEY (`id_Skelbimas`),
  KEY `fk_Imoneid_Imone` (`fk_Imoneid_Imone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `vartotojai` (
  `vardas` varchar(255) NOT NULL,
  `pavarde` varchar(255) NOT NULL,
  `e_pastas` varchar(255) NOT NULL,
  `slapyvardis` varchar(255) NOT NULL,
  `slaptazodis` varchar(255) NOT NULL,
  `tel_nr` varchar(255) DEFAULT NULL,
  `miestas` varchar(255) DEFAULT NULL,
  `role` char(17) DEFAULT NULL,
  `busena` char(11) DEFAULT NULL,
  `id_Vartotojas` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_Vartotojas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `zinutes` (
  `tekstas` varchar(255) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `busena` char(17) DEFAULT NULL,
  `id_Zinute` int(11) NOT NULL AUTO_INCREMENT,
  `fk_Vartotojasid_Vartotojas` int(11) NOT NULL,
  `fk_Pokalbisid_Pokalbis` int(11) NOT NULL,
  PRIMARY KEY (`id_Zinute`),
  KEY `fk_Vartotojasid_Vartotojas` (`fk_Vartotojasid_Vartotojas`),
  KEY `fk_Pokalbisid_Pokalbis` (`fk_Pokalbisid_Pokalbis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `imones`
ADD CONSTRAINT `imones_ibfk_1`
FOREIGN KEY (`fk_Vartotojasid_Vartotojas`)
REFERENCES `vartotojai` (`id_Vartotojas`);


ALTER TABLE `megstamiausi`
ADD CONSTRAINT `megstamiausi_ibfk_1`
FOREIGN KEY (`fk_Skelbimasid_Skelbimas`)
REFERENCES `skelbimai` (`id_Skelbimas`),
ADD CONSTRAINT `megstamiausi_ibfk_2`
FOREIGN KEY (`fk_Vartotojasid_Vartotojas`)
REFERENCES `vartotojai` (`id_Vartotojas`);


ALTER TABLE `modeliai`
ADD CONSTRAINT `modeliai_ibfk_1`
FOREIGN KEY (`fk_Vartotojasid_Vartotojas`)
REFERENCES `vartotojai` (`id_Vartotojas`);


ALTER TABLE `nuotraukos`
ADD CONSTRAINT `nuotraukos_ibfk_1`
FOREIGN KEY (`fk_Skelbimasid_Skelbimas`)
REFERENCES `skelbimai` (`id_Skelbimas`);


ALTER TABLE `pokalbiai`
ADD CONSTRAINT `pokalbiai_ibfk_1`
FOREIGN KEY (`fk_Vartotojasid_Vartotojas1`)
REFERENCES `vartotojai` (`id_Vartotojas`),
ADD CONSTRAINT `pokalbiai_ibfk_2`
FOREIGN KEY (`fk_Vartotojasid_Vartotojas2`)
REFERENCES `vartotojai` (`id_Vartotojas`),
ADD CONSTRAINT `pokalbiai_ibfk_3`
FOREIGN KEY (`fk_Skelbimasid_Skelbimas`)
REFERENCES `skelbimai` (`id_Skelbimas`);


ALTER TABLE `skelbimai`
ADD CONSTRAINT `skelbimai_ibfk_1`
FOREIGN KEY (`fk_Imoneid_Imone`)
REFERENCES `imones` (`id_Imone`);


ALTER TABLE `zinutes`
ADD CONSTRAINT `zinutes_ibfk_1`
FOREIGN KEY (`fk_Vartotojasid_Vartotojas`)
REFERENCES `vartotojai` (`id_Vartotojas`),
ADD CONSTRAINT `zinutes_ibfk_2`
FOREIGN KEY (`fk_Pokalbisid_Pokalbis`)
REFERENCES `pokalbiai` (`id_Pokalbis`);