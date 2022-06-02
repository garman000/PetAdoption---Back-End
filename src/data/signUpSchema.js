const signUpSchema = {
  type: "object",
  properties: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: ["string", "integer"], minLength: 6 },
    password: { type: ["string", "integer"], minLength: 6 },
    id: { type: "string" },
  },
  required: ["firstname", "lastname", "email", "password"],
};

export default signUpSchema;
