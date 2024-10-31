const TelegramBot = require('node-telegram-bot-api');
const token = '8110182421:AAEMHbfKB7F6Ge6KcUAU9xG0rciKZUZDo54';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Hi there! I'm your friendly child development companion.");
  showMainMenu(chatId);
});

// Main Menu
function showMainMenu(chatId) {
  bot.sendMessage(chatId, "Choose an option:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Child's Information", callback_data: 'child_info' }],
        [{ text: "Checklist", callback_data: 'checklist' }],
        [{ text: "Join our community", callback_data: 'community' }],
        [{ text: "Articles and Resources", callback_data: 'resources' }],
        [{ text: "Expert Advice", callback_data: 'expert' }],
      ],
    },
  });
}

// Handling the main menu selections
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  switch (data) {
    case 'child_info':
      askChildAge(chatId);
      break;
    case 'checklist':
      showChecklistMenu(chatId);
      break;
    case 'community':
      bot.sendMessage(chatId, "Join our community here: [Community Link]");
      break;
    case 'resources':
      bot.sendMessage(chatId, "Explore resources here: [CDC Resources Link]");
      break;
    case 'expert':
      bot.sendMessage(chatId, "Connect with a pediatrician here: [Expert Link]");
      break;
  }
});

// Asking for child's age with inline buttons
function askChildAge(chatId) {
  bot.sendMessage(chatId, "Select your child's age:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "18 months", callback_data: 'age_18_months' }],
        [{ text: "2 years", callback_data: 'age_2_years' }],
        [{ text: "3 years", callback_data: 'age_3_years' }],
      ],
    },
  });
}

// Handle age selection and ask for gender
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('age_')) {
    const age = data.split('_')[1]; // Extract age from callback data
    askChildGender(chatId, age);
  }
});

function askChildGender(chatId, age) {
  bot.sendMessage(chatId, "Select your child's gender:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Male", callback_data: `gender_Male_${age}` }],
        [{ text: "Female", callback_data: `gender_Female_${age}` }],
      ],
    },
  });
}

// Display milestones based on age and gender selection
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('gender_')) {
    const [_, gender, age] = data.split('_'); // Parse gender and age
    displayMilestones(chatId, age, gender);
  }
});

function displayMilestones(chatId, age, gender) {
  let milestones;
  switch (age) {
    case "18":
      milestones = "18 Months Milestones:\n- Shows affection...\n- Plays simple pretend...";
      break;
    case "2":
      milestones = "2 Years Milestones:\n- Shows defiant behavior...\n- Plays beside other children...";
      break;
    case "3":
      milestones = "3 Years Milestones:\n- Shows concern for a crying friend...\n- Climbs well...";
      break;
    default:
      milestones = "Invalid age entered.";
  }
  bot.sendMessage(chatId, `${milestones}\n\nGender: ${gender}`);
}

// Checklist menu with age selection
function showChecklistMenu(chatId) {
  bot.sendMessage(chatId, "Choose your child's age for the checklist:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "18 months", callback_data: 'checklist_18' }],
        [{ text: "2 years", callback_data: 'checklist_2' }],
        [{ text: "3 years", callback_data: 'checklist_3' }],
      ],
    },
  });
}

// Display checklist questions based on age selection
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('checklist_')) {
    const age = data.split('_')[1];
    showChecklistQuestions(chatId, age);
  }
});

function showChecklistQuestions(chatId, age) {
  let questions;
  if (age === "18") {
    questions = "18 Months Checklist:\n1. Shows affection to familiar people (Yes, Maybe, No)\n...";
  } else if (age === "2") {
    questions = "2 Years Checklist:\n1. Shows defiant behavior (Yes, Maybe, No)\n...";
  } else if (age === "3") {
    questions = "3 Years Checklist:\n1. Shows concern for a crying friend (Yes, Maybe, No)\n...";
  }
  bot.sendMessage(chatId, questions, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Yes", callback_data: `response_yes_${age}` }],
        [{ text: "Maybe", callback_data: `response_maybe_${age}` }],
        [{ text: "No", callback_data: `response_no_${age}` }],
      ],
    },
  });
}

// Example red flags recommendations
function showRecommendations(chatId, age) {
  let redFlags;
  if (age === "18") {
    redFlags = "18 Months Red Flags:\n- Doesn't point to show things to others\n...";
  } else if (age === "2") {
    redFlags = "2 Years Red Flags:\n- Doesn't use 2-word phrases...\n";
  } else if (age === "3") {
    redFlags = "3 Years Red Flags:\n- Falls down a lot or has trouble with stairs...\n";
  }
  bot.sendMessage(chatId, redFlags);
}
