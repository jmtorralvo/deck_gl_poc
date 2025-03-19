import fs from "node:fs";
import { faker } from "@faker-js/faker";

function getData(amount) {
	const foo = faker.helpers.multiple(
		() => ({
			key: faker.string.uuid(),
			title: faker.person.fullName(),
			position: {
				lat: faker.location.latitude({ min: 50, max: 56 }),
				lng: faker.location.longitude({ min: -6, max: 0 }),
			},
			category: faker.helpers.arrayElement([
				"tree",
				"bush",
				"flower",
				"grass",
				"weed",
				"maple",
				"ash",
				"oak",
				"elm",
				"pine",
				"birch",
				"beech",
				"willow",
			]),
			// type: faker.helpers.arrayElement(["pin", "html"]),
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
