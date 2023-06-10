const qrcode = require("qrcode-terminal");
const axios = require("axios");
const { Client } = require("whatsapp-web.js");
const User = require("./../models/user");

const client = new Client();

let userConvoState = {};

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  let user = await User.findOne({ whatsappNumber: msg.from });
  const baseUrl = "https://periodtrackerbackend-production.up.railway.app";

  if (!userConvoState[msg.from]) {
    userConvoState[msg.from] = { stage: 0 };
  }

  if (msg.body == "!memai") {
    let user = await User.findOne({ whatsappNumber: msg.from });

    if (!user) {
      userConvoState[msg.from].stage = 1;
      client.sendMessage(
        msg.from,
        "Hello, welcome to MemAi! Your wellness friend. We are glad to have you onboard. Please type !update to register."
      );
      // Create a new user
      user = new User({ whatsappNumber: msg.from });
      await user.save();

      userConvoState[msg.from] = { stage: 0 };
    } else {
      client.sendMessage(
        msg.from,
        `Welcome back to MemAi, ${user.name}! Type !update to update your details (or) !help to get a list of all the available commands.`
      );
    }
  } else if (msg.body.startsWith("!help")) {
    client.sendMessage(
      msg.from,
      "1) !profile to view your details. \n2) !update to enter/edit your profile details \n3) !history to edit your period details. \n4) !predict to predict your next period date."
    );

  } else if (msg.body.startsWith("!update")) {
    if (!user) {
      client.sendMessage(
          msg.from,
          "No details found. Please register by typing !memai."
      );
    } else {
      if (userConvoState[msg.from].stage === 0) {
        client.sendMessage(
            msg.from,
            "Enter your name."
        );
        userConvoState[msg.from].stage = 1;
      } else if (userConvoState[msg.from].stage === 1) {
        user.name = msg.body;
        client.sendMessage(
            msg.from,
            "Enter your age."
        );
        userConvoState[msg.from].stage = 2;
      } else if (userConvoState[msg.from].stage === 2) {
        user.age = msg.body;
        client.sendMessage(
            msg.from,
            "Enter your weight."
        );
        userConvoState[msg.from].stage = 3;
      } else if (userConvoState[msg.from].stage === 3) {
        user.weight = msg.body;
        client.sendMessage(
            msg.from,
            "Enter your height."
        );
        userConvoState[msg.from].stage = 4;
      } else if (userConvoState[msg.from].stage === 4) {
        user.height = msg.body;
        client.sendMessage(
            msg.from,
            "Enter your BMI."
        );
        userConvoState[msg.from].stage = 5;
      } else if (userConvoState[msg.from].stage === 5) {
        user.bmi = msg.body;
        client.sendMessage(
            msg.from,
            "Enter your race:\n0 - Asian\n1 - Black\n2 - Hispanic\n3 - Native American\n4 - White"
        );
        userConvoState[msg.from].stage = 6;
      } else if (userConvoState[msg.from].stage === 6) {
        user.race = msg.body;
        client.sendMessage(
            msg.from,
            "Enter your medical history:\n0 - Asthma\n1 - Cancer\n2 - Diabetes\n3 - Endometriosis\n4 - Heart Disease\n5 - Nothing\n6 - PCOS"
        );
        userConvoState[msg.from].stage = 7;
      } else if (userConvoState[msg.from].stage === 7) {
        user.medicalHistory = msg.body;
        client.sendMessage(
            msg.from,
            "Enter your medications:\n0 - Antidepressants\n1 - Birth Control\n2 - Nothing\n3 - Pain Medication"
        );
        userConvoState[msg.from].stage = 8;
      } else if (userConvoState[msg.from].stage === 8) {
        user.medications = msg.body;
        await user.save();
        client.sendMessage(
            msg.from,
            "User details saved. You can now use other commands. For a list of commands, type !help."
        );
        delete userConvoState[msg.from];
      }
    }
  } else if (msg.body.startsWith("!profile")) {
    if (user) {
      client.sendMessage(
        msg.from,
        `Your details are as follows:\n
        Name: ${user.name}\n
        Age: ${user.age}\n
        Weight: ${user.weight}\n
        Height: ${user.height}\n
        BMI: ${user.bmi}\n
        Race: ${user.race}\n
        Medical History: ${user.medicalHistory}\n
        Medications: ${user.medications}\n`
      );
    } else {
      client.sendMessage(
        msg.from,
        "No details found. Please register by typing !start."
      );
    }
  } else if (msg.body.startsWith("!history")) {
    if (user) {
      client.sendMessage(
        msg.from,
        `Your last cycle details are as follows"\n
        Last: ${user.last}\n
        Flow: ${user.flow}\n
        Cramps: ${user.cramps}\n
        Mood: ${user.mood}\n
        Ovulation: ${user.ovulation}\n
        Menstrual Cycle: ${user.lengthOfMenstrualCycle}\n
        Menses: ${user.lengthOfMenses}
        `
      );
    }
  } else if (msg.body.startsWith("!cycle")) {
    if (userConvoState[msg.from].stage === 0) {
      client.sendMessage(
          msg.from,
          "Enter the last date of your period in the following format: YYYY-MM-DD"
      );
      userConvoState[msg.from].stage = 1;
    } else if (userConvoState[msg.from].stage === 1) {
      user.last = msg.body;
      client.sendMessage(
          msg.from,
          "Enter the flow of your period (Light, Medium, Heavy)"
      );
      userConvoState[msg.from].stage = 2;
    } else if (userConvoState[msg.from].stage === 2) {
      user.flow = msg.body;
      client.sendMessage(
          msg.from,
          "Do you experience cramps during your period? (Yes, No)"
      );
      userConvoState[msg.from].stage = 3;
    } else if (userConvoState[msg.from].stage === 3) {
      user.cramps = msg.body;
      client.sendMessage(
          msg.from,
          "How would you describe your mood during your period? (Happy, Sad, Normal)"
      );
      userConvoState[msg.from].stage = 4;
    } else if (userConvoState[msg.from].stage === 4) {
      user.mood = msg.body;
      client.sendMessage(
          msg.from,
          "Do you experience ovulation symptoms? (Yes, No)"
      );
      userConvoState[msg.from].stage = 5;
    } else if (userConvoState[msg.from].stage === 5) {
      user.ovulation = msg.body;
      client.sendMessage(
          msg.from,
          "Enter the length of your menstrual cycle in days"
      );
      userConvoState[msg.from].stage = 6;
    } else if (userConvoState[msg.from].stage === 6) {
      user.lengthOfMenstrualCycle = msg.body;
      client.sendMessage(
          msg.from,
          "Enter the length of your menses in days"
      );
      userConvoState[msg.from].stage = 7;
    } else if (userConvoState[msg.from].stage === 7) {
      user.lengthOfMenses = msg.body;
      await user.save();
      client.sendMessage(
          msg.from,
          "Cycle details saved. You can now use other commands. For a list of commands, type !help."
      );
      delete userConvoState[msg.from];
    }
  } else if (msg.body.startsWith("!predict")) {
    if (!user) {
      client.sendMessage(
        msg.from,
        "No details found. Please register by typing !start."
      );
    } else {
      axios
        .post(`${baseUrl}/api/predict`, {
          Last: user.last,
          Flow: user.flow,
          Cramps: user.cramps,
          Mood: user.mood,
          Ovulation: user.ovulation,
          Age: user.age,
          Weight: user.weight,
          Height: user.height,
          BMI: 20,
          Race: "Native American",
          Medical_history: "Nothing",
          Medications: "Birth Control",
          Length_of_menstrual_cycle: user.lengthOfMenstrualCycle,
          Length_of_menses: user.lengthOfMenses,
        })
        .then((response) => {
          console.log(response.data.Next);
          client.sendMessage(
            msg.from,
            `Your next predicted cycle is on:\n\nNext: ${response.data.Next}\n`
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  } else {
    client.sendMessage(
      msg.from,
      "Sorry, I didn't understand that. Type !help to get a list of all the available commands."
    );
  }
});

client.initialize();
