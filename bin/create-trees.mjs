import { faker } from "@faker-js/faker";
import fs from "node:fs";
import { ICON_IMAGES } from "../src/const";

function getData(amount) {
	const foo = faker.helpers.multiple(
		() => ({
			key: faker.string.uuid(),
			title: faker.person.fullName(),
			position: {
				lat: faker.location.latitude({ min: 50, max: 56 }),
				lng: faker.location.longitude({ min: -6, max: 0 }),
			},
			category: faker.helpers.arrayElement(Object.values(ICON_IMAGES)),
			zIndex: faker.number.int(100),
		}),
		{
			count: Number(amount) || 2000,
		},
	);

	return foo;
}

const createFile = (amount) => {
	const data = getData(amount);
	const json = JSON.stringify(data);
	fs.writeFileSync("./src/data/mockedTrees.json", json);
};

const args = process.argv.slice(2);
createFile(args[0]);
