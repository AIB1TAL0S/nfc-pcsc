"use strict";

import { NFC, KEY_TYPE_A } from "../src/index";
import pretty from "./pretty-logger";

const nfc = new NFC();

nfc.on("reader", async (reader) => {
	pretty.info(`device attached`, reader);

	reader.on("card", async (card) => {
		pretty.info(`card detected`, reader, card);

		try {
			// Authenticate the block before writing
			await reader.authenticate(4, KEY_TYPE_A, "ffffffffffff");
			const data = await reader.read(4, 16); // starts reading in block 4, to read 16 bytes
			// Convert the data to a string using 'utf8' encoding and remove any non-printable characters
			const payload = data.toString("utf8").replace(/[^ -~]/g, "");
			console.log(`data read`, payload);
		} catch (err) {
			pretty.error(`error when reading data`, reader, err);
		}

		try {
			// Authenticate the block before writing
			await reader.authenticate(4, KEY_TYPE_A, "ffffffffffff");
			const data = await reader.read(4, 16); // starts reading in block 4, to read 16 bytes
			// Convert the data to a string using 'utf8' encoding and remove any non-printable characters
			const payload = data.toString("utf8").replace(/[^ -~]/g, "");
			console.log(`data converted`, payload);

			// Prepare new data to write
			const newData = Buffer.allocUnsafe(16).fill(0); // Adjusted to 16 bytes
			newData.write("202211013");

			// Write data to the NFC tag, specifying the block size as 16
			await reader.write(4, newData, 16); // starts writing in block 4
			// Convert the new data to a string using 'utf8' encoding and remove any non-printable characters
			console.log(
				`data written`,
				newData.toString("utf8").replace(/[^ -~]/g, "")
			);
		} catch (err) {
			pretty.error(`error when reading or writing data`, reader, err);
		}
	});

	reader.on("error", (err) => {
		pretty.error(`an error occurred`, reader, err);
	});

	reader.on("end", () => {
		pretty.info(`device removed`, reader);
	});
});

nfc.on("error", (err) => {
	pretty.error(`an error occurred`, err);
});
