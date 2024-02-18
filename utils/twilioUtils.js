import Twilio from "twilio";
import cron from "node-cron";
import User from "../models/User.js";
import Task from "../models/Task.js";

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// cron job for calling users based on the priority of users.
const twilioCallCronLogic = () => {
  
  const twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
  cron.schedule("* * * * *", async () => {
    try {
      let contactNumbers = [];
      const users = await User.find().sort({ priority: 1 });
      for (const user of users) {
        const tasks = await Task.find({
          createdBy: user._id,
          status: { $not: { $eq: "DONE" } },
        });
        if (tasks.length > 0) {
          tasks.forEach((task) => {
            if (task.due_date < new Date() && task.deleted_at == null) {
              // get the numbers to call.
              //   console.log(`call ${task.createdBy}`);
              // store all the contact numbers with the user id to be called in an array.
              contactNumbers.push([task.createdBy, user.phone]);
            }
          });
        }
      }
      //   Storing numbers to call only once per user after removing duplicates based on unique id of users
      let numbers = [];
      let index = 0;
      for (let i = 1; i < contactNumbers.length; i++) {
        if (contactNumbers[index][0] == contactNumbers[i][0]) {
          index++;
        } else {
          numbers.push(contactNumbers[index][1]);
          index++;
        }
      }

      // Function to initiate a voice call using Twilio
      const initiateVoiceCall = async (to, message) => {
        try {
          const call = await twilioClient.calls.create({
            twiml: `<Response><Say>${message}</Say></Response>`,
            to: `+91${to}`,
            from: +15109841571,
          });
          console.log(`Voice call initiated to ${to}, Call SID: ${call.sid}`);
          return call.sid;
        } catch (error) {
          console.error(`Error initiating voice call to ${to}:`, error);
          throw error;
        }
      };

      // Function to check the status of a Twilio call
      const checkCallStatus = async (callSid) => {
        try {
          //         const call = await twilioClient.calls(callSid).fetch();

          // // Get and log the call status
          // const callStatus = call.status;
          const getCall = await twilioClient.calls(callSid).fetch();
          //   console.log(getCall);
          //   const call = await getCall();
          console.log(`Call status for ${callSid}: ${getCall.status}`);
          return getCall.status;
        } catch (error) {
          console.error(`Error checking call status for ${callSid}:`, error);
          throw error;
        }
      };

      // Function to call users asynchronously
      const callUsersAsync = async (userPhoneNumbers, message) => {
        for (const phoneNumber of userPhoneNumbers) {
          try {
            const callSid = await initiateVoiceCall(phoneNumber, message);

            // Wait for some time  to check call status
            await new Promise((resolve) => setTimeout(resolve, 50 * 1000));

            const callStatus = await checkCallStatus(callSid);

            // If the user didn't pick up, proceed to the next user
            if (callStatus !== "completed") {
              console.log(
                `User ${phoneNumber} did not pick up. Trying the next user.`
              );
            } else {
              console.log(
                `User ${phoneNumber} picked up the call. Call completed.`
              );
              break; // Exit the loop if the call is completed successfully
            }
          } catch (error) {
            console.error(`Error calling user ${phoneNumber}:`, error);
          }
        }
      };

      // Example usage
      const message = "Your task is overdue. Please take immediate action.";

      callUsersAsync(numbers, message);
    } catch (error) {
      console.error("Error making Twilio voice call:", error);
    }
  });
  
};

export { twilioCallCronLogic };
