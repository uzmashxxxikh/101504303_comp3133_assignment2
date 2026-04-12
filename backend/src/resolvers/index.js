const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLScalarType, Kind } = require('graphql');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');
const { 
  isValidEmail, 
  isValidPassword, 
  isValidUsername, 
  isValidSalary,
  isValidGender,
  isValidDate
} = require('../utils/validators');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});

const resolvers = {
  Date: dateScalar,

  Query: {
    async login(_, { input }) {
      const { usernameOrEmail, password } = input;

      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || 'devsecret',
        { expiresIn: '1d' }
      );

      return {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      };
    },

    async getAllEmployees() {
      const employees = await Employee.find();
      return employees.map(e => ({
        id: e._id.toString(),
        ...e.toObject()
      }));
    },

    async getEmployeeById(_, { id }) {
      const emp = await Employee.findById(id);
      if (!emp) return null;
      return { id: emp._id.toString(), ...emp.toObject() };
    },

    async searchEmployees(_, { designation, department }) {
      const filter = {};
      if (designation) {
        filter.designation = { $regex: designation, $options: 'i' };
      }
      if (department) {
        filter.department = { $regex: department, $options: 'i' };
      }
      const employees = await Employee.find(filter);
      return employees.map(e => ({
        id: e._id.toString(),
        ...e.toObject()
      }));
    }
  },

  Mutation: {
    async signup(_, { input }) {
      const { username, email, password } = input;

      if (!isValidUsername(username)) {
        throw new Error('Username must be between 3 and 50 characters');
      }

      if (!isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) {
        throw new Error('Username or email already exists');
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        email,
        password: hashed
      });

      await user.save();

      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    },

    async addEmployee(_, { input }) {
      if (!isValidEmail(input.email)) {
        throw new Error('Invalid email format');
      }

      if (!isValidSalary(input.salary)) {
        throw new Error('Salary must be >= 1000');
      }

      if (!isValidGender(input.gender)) {
        throw new Error('Gender must be Male, Female, or Other');
      }

      if (!isValidDate(input.date_of_joining)) {
        throw new Error('Invalid date format');
      }

      let photoUrl = input.employee_photo;
      if (input.employee_photo) {
        try {
          photoUrl = await uploadToCloudinary(input.employee_photo);
        } catch (error) {
          console.error('Photo upload failed:', error.message);
          photoUrl = null;
        }
      }

      const employee = new Employee({ 
        ...input,
        employee_photo: photoUrl
      });
      await employee.save();

      return {
        id: employee._id.toString(),
        ...employee.toObject()
      };
    },

    async updateEmployeeById(_, { id, input }) {
      if (input.salary && input.salary < 1000) {
        throw new Error('Salary must be >= 1000');
      }

      if (input.employee_photo) {
        try {
          input.employee_photo = await uploadToCloudinary(input.employee_photo);
        } catch (error) {
          console.error('Photo upload failed:', error.message);
          delete input.employee_photo;
        }
      }

      const emp = await Employee.findByIdAndUpdate(
        id,
        { ...input, updated_at: new Date() },
        { new: true }
      );

      if (!emp) {
        throw new Error('Employee not found');
      }

      return {
        id: emp._id.toString(),
        ...emp.toObject()
      };
    },

    async deleteEmployeeById(_, { id }) {
      const result = await Employee.findByIdAndDelete(id);
      return !!result;
    }
  }
};

module.exports = resolvers;
