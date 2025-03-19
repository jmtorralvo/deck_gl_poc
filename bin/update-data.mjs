import { faker } from "@faker-js/faker";
import fs from "node:fs";
import { AREAS, ICON_IMAGES } from "../src/const";

const dataPath = "./src/data/";
// Lee el archivo JSON original
fs.readFile(`${dataPath}audit_mock_2.json`, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading the file:", err);
		return;
	}

	// Parsear el contenido del archivo JSON
	let jsonData = JSON.parse(data);

	// Iterar sobre cada elemento y añadir nuevos campos
	jsonData = jsonData.map((item) => {
		return {
			...item,
			title: faker.person.fullName(),
			category: faker.helpers.arrayElement(Object.values(ICON_IMAGES)),
			area: faker.helpers.arrayElement(AREAS),
			zIndex: faker.number.int(100),
		};
	});

	// Convertir el JSON modificado a una cadena
	const newJsonData = JSON.stringify(jsonData, null, 2);

	// Escribir el nuevo JSON en un archivo
	fs.writeFile(`${dataPath}data.json`, newJsonData, "utf8", (err) => {
		if (err) {
			console.error("Error reading the file:", err);
			return;
		}
		console.log("Modified JSON file created successfully.");
	});
});
