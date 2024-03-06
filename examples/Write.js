const { NFC, KEY_TYPE_A } = require("nfc-pcsc");
const nfc = new NFC();

nfc.on("reader", (reader) => {
	reader.on("card", async (card) => {
		try {
			// Authenticate the block before writing
			await reader.authenticate(4, KEY_TYPE_A, "ffffffffffff");

			// Prepare the ASCII data to write
			const asciiString = "Hi"; // The ASCII string to write
			const data = Buffer.from(asciiString, "ascii"); // Convert the string to ASCII bytes

			// Write the data to the card, specifying the block size
			await reader.write(4, data, 16);

			console.log('ASCII data "Hi" written successfully');
		} catch (err) {
			console.error("Error when writing ASCII data:", err);
		}
	});
});
