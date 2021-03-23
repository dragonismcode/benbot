require("dotenv").config();

const fetch = require("node-fetch");
const fs = require("fs");
const {
  raw: { connect },
  wrap
} = require("dogehouse-js");

const main = async () => {
  try {
    const connection = await connect(
      process.env.DOGEHOUSE_TOKEN,
      process.env.DOGEHOUSE_REFRESH_TOKEN,
      {
        onConnectionTaken: () => {
          console.error(
            "Another web socket connection has been opened. This usally means that you have logged in from somewhere else."
          );
        }
      }
    );

    const wrapper = wrap(connection);

    const rooms = await wrapper.getTopPublicRooms();
    const theRoom = rooms[0];
    var faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];

    console.log(
      `(-) => joining room "${theRoom.name}" (${theRoom.numPeopleInside} people)`
    );
    await wrapper.joinRoom("7bc9d28e-b2f0-4acf-ac23-a50199e52ada");

    async function GenerateWelcome() {
      var responses = [
        "🛋️ BenBot has entered the room!",
        "🚪 BenBot has slammed down the door!",
        "🚪 BenBot has slammed down the door!",
        "🔦 BenBot has entered the dark alley!",
        "🚐 BenBot entered the white van that offered him candy!",
        "🏠 BenBot is in the house!",
        "🔥 BenBot refused to go to heaven so is in hell instead!"
      ];
      var response = responses[Math.floor(Math.random() * responses.length)];
      await wrapper.sendRoomChatMsg([
        {
          t: "text",
          v: response + " For a list of commands, please type !help."
        }
      ]);
    }

    GenerateWelcome();

    wrapper.listenForChatMsg(async ({ userId, msg }) => {
      if (msg.tokens[0].v.toLowerCase() === "!creator") {
        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v: `My creator is Dragonism! Special thanks to drunkenpirate47x for helping me make the slap/yeet command!`
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase() === "!findcute") {
        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v: "Trying to find someone cute... please wait!"
          }
        ]);
        setTimeout(async function () {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "After much consideration... I have decided that"
            },
            {
              t: "mention",
              v: msg.username
            },
            {
              t: "text",
              v: "is cute."
            }
          ]);
        }, 2000);
      }

      if (msg.tokens[0].v.toLowerCase() === "!whereami") {
        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v: "You are currently in: " + theRoom.name
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase() === "!whoami") {
        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v: "Your name is: "
          },
          {
            t: "mention",
            v: msg.username
          },
          {
            t: "text",
            v: "(" + msg.userId + ")"
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase().startsWith("!8ball")) {
        async function GenerateAnswer() {
          var responses = [
            "It is certain",
            "Without a doubt",
            "Most likely",
            "Yes",
            "Reply hazy try again",
            "Ask again later",
            "My reply is no",
            "No",
            "Very doubtful"
          ];
          var response =
            responses[Math.floor(Math.random() * responses.length)];
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "8ball says: " + response
            }
          ]);
        }
        GenerateAnswer();
      }

      if (msg.tokens[0].v.toLowerCase() === "!help") {
        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v:
              "𝗟𝗶𝘀𝘁 𝗼𝗳 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: !8ball ● !slap (user) ● !yeet (user) ● !say (words) ● !dadjoke ● !joke ● !howgay ● !owoify (text) ● !rolldice ● !coinflip ● !findcute ● !whoami ● !whereami ● !creator ● !github"
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase() === "!github") {
        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v: "Help us make BenBot: "
          },
          {
            t: "link",
            v: "https://github.com/dragonismcode/benbot"
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase() === "!howgay") {
        var howPercentage = Math.floor(Math.random() * 100) + 1;
        await wrapper.sendRoomChatMsg([
          {
            t: "mention",
            v: msg.username
          },
          {
            t: "text",
            v: "is " + howPercentage + "% gay."
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase() === "!say") {
        const newArray = msg.tokens.slice();
        newArray.shift();
        const normaltext = newArray.map((t) => t.v).join(" ");

        if (normaltext) {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: normaltext
            }
          ]);
        } else {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "You gotta provide something. I can't just say nothing."
            }
          ]);
        }
      }

      if (msg.tokens[0].v.toLowerCase() === "!owoify") {
        const newArray = msg.tokens.slice();
        newArray.shift();
        const textToOwo = newArray.map((t) => t.v).join(" ");

        async function OwoifyText() {
          var v = textToOwo;
          v = v.replace(/(?:r|l)/g, "w");
          v = v.replace(/(?:R|L)/g, "W");
          v = v.replace(/n([aeiou])/g, "ny$1");
          v = v.replace(/N([aeiou])/g, "Ny$1");
          v = v.replace(/N([AEIOU])/g, "Ny$1");
          v = v.replace(/ove/g, "uv");
          v = v.replace(
            /\!+/g,
            " " + faces[Math.floor(Math.random() * faces.length)] + " "
          );
          var finishedowo = v;
          console.log(finishedowo);

          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "𝗬𝗼𝘂𝗿 𝘁𝗲𝘅𝘁 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗼𝘄𝗼𝗶𝗳𝗶𝗲𝗱 𝘁𝗼: " + finishedowo
            }
          ]);
        }

        if (textToOwo) {
          OwoifyText();
        } else {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "You nyeed to pwovide something! I cannyot owoify nyothing..."
            }
          ]);
        }
      }

      if (msg.tokens[0].v.toLowerCase() === "!joke") {
        function doTheFunny() {
          fetch("https://v2.jokeapi.dev/joke/Programming")
            .then((response) => response.json())
            .then(async (data) => {
              if (data.setup) {
                await wrapper.sendRoomChatMsg([
                  {
                    t: "text",
                    v: data.setup + " " + data.delivery
                  }
                ]);
              } else {
                await wrapper.sendRoomChatMsg([
                  {
                    t: "text",
                    v: data.joke
                  }
                ]);
              }
            });
        }

        doTheFunny();
      }

      if (msg.tokens[0].v.toLowerCase() === "!dadjoke") {
        function doTheUnfunny() {
          fetch("https://icanhazdadjoke.com/slack")
            .then((response) => response.json())
            .then(async (data) => {
              await wrapper.sendRoomChatMsg([
                {
                  t: "text",
                  v: data.attachments[0].text
                }
              ]);
            });
        }

        doTheUnfunny();
      }

      if (msg.tokens[0].v.toLowerCase() === "!requestspeaker") {
        if (msg.userId === "b4c3169e-9ae4-4fb8-a4a2-bdfce065a6a5") {
          await connection.send("ask_to_speak", {});

          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "🔊 Requested to become a speaker..."
            }
          ]);
        } else {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "No permission.. :("
            }
          ]);
        }
      }

      if (msg.tokens[0].v.toLowerCase() === "!rolldice") {
        var rollDice = Math.floor(Math.random() * 6) + 1;

        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v: "🎲 The dice rolled: " + rollDice
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase() === "!uptime") {
        function format(seconds) {
          function pad(s) {
            return (s < 10 ? "0" : "") + s;
          }
          var hours = Math.floor(seconds / (60 * 60));
          var minutes = Math.floor((seconds % (60 * 60)) / 60);
          var seconds = Math.floor(seconds % 60);

          return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
        }

        var uptime = process.uptime();
        console.log(format(uptime));

        await wrapper.sendRoomChatMsg([
          {
            t: "text",
            v: "Uptime: " + format(uptime)
          }
        ]);
      }

      if (msg.tokens[0].v.toLowerCase() === "!coinflip") {
        var coinresult = Math.floor(Math.random() * 2);
        console.log(coinresult);
        if (coinresult == 0) {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "🪙 The coin landed on: " + "Heads"
            }
          ]);
        } else {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "🪙 The coin landed on: " + "Tails"
            }
          ]);
        }
      }

      if (msg.tokens[0].v.toLowerCase() === "!slap") {
        const found_user = await (await wrapper.getRoomUsers()).users.find(
          (user) => user.username === msg.tokens[1].v
        );
        if (found_user) {
          if (found_user.username !== msg.username) {
            if (found_user.username !== "benbot") {
              await wrapper.sendRoomChatMsg([
                {
                  t: "text",
                  v: "👋"
                },
                {
                  t: "mention",
                  v: msg.username
                },
                {
                  t: "text",
                  v: `just slapped`
                },
                {
                  t: "mention",
                  v: found_user.username
                },
                {
                  t: "text",
                  v: "straight in the face! That must have hurt..."
                }
              ]);
            } else {
              await wrapper.sendRoomChatMsg([
                {
                  t: "text",
                  v: "🤖"
                },
                {
                  t: "mention",
                  v: msg.username
                },
                {
                  t: "text",
                  v: `just tried to slap `
                },
                {
                  t: "mention",
                  v: found_user.username
                },
                {
                  t: "text",
                  v: "but they graduated top of their class in the Navy Seals."
                }
              ]);
            }
          } else {
            await wrapper.sendRoomChatMsg([
              {
                t: "text",
                v: "🤖"
              },
              {
                t: "mention",
                v: msg.username
              },
              {
                t: "text",
                v: `just tried to slap `
              },
              {
                t: "mention",
                v: found_user.username
              },
              {
                t: "text",
                v: "but their face is made of metal!"
              }
            ]);
          }
        } else {
          await wrapper.sendRoomChatMsg([
            {
              t: "mention",
              v: msg.username
            },
            {
              t: "text",
              v: "You can't slap yourself or someone who isn't in this room."
            }
          ]);
        }
      }

      if (msg.tokens[0].v.toLowerCase() === "!yeet") {
        const found_user = await (await wrapper.getRoomUsers()).users.find(
          (user) => user.username === msg.tokens[1].v
        );
        if (found_user) {
          if (found_user.username !== msg.username) {
            if (found_user.username !== "benbot") {
              if (found_user.username !== "dodgycoin") {
                await wrapper.sendRoomChatMsg([
                  {
                    t: "text",
                    v: "👋"
                  },
                  {
                    t: "mention",
                    v: msg.username
                  },
                  {
                    t: "text",
                    v: `just yeeted`
                  },
                  {
                    t: "mention",
                    v: found_user.username
                  },
                  {
                    t: "text",
                    v: "across the world! They're probably dead..."
                  }
                ]);
              } else {
                await wrapper.sendRoomChatMsg([
                  {
                    t: "text",
                    v: "🤖"
                  },
                  {
                    t: "mention",
                    v: msg.username
                  },
                  {
                    t: "text",
                    v: `just tried to yeet `
                  },
                  {
                    t: "mention",
                    v: found_user.username
                  },
                  {
                    t: "text",
                    v:
                      "but they graduated top of their class in the Navy Seals."
                  }
                ]);
              }
            } else {
              await wrapper.sendRoomChatMsg([
                {
                  t: "text",
                  v: "🤖"
                },
                {
                  t: "mention",
                  v: msg.username
                },
                {
                  t: "text",
                  v: `just tried to yeet `
                },
                {
                  t: "mention",
                  v: found_user.username
                },
                {
                  t: "text",
                  v: "but they're too heavy!"
                }
              ]);
            }
          } else {
            await wrapper.sendRoomChatMsg([
              {
                t: "mention",
                v: msg.username
              },
              {
                t: "text",
                v: "You can't yeet yourself! Someone has to yeet you."
              }
            ]);
          }
        } else {
          await wrapper.sendRoomChatMsg([
            {
              t: "text",
              v: "Sorry! You can not yeet someone who is not in your room."
            }
          ]);
        }
      }

      const text = msg.tokens.map((t) => t.v).join(" ");

      if (userId !== connection.user.id) {
        console.log(`${msg.displayName} > ${text}`);
      }
    });
  } catch (e) {
    if (e.code === 4001) console.error("invalid token!");
  }
};

main();
