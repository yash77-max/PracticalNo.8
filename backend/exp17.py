#Write a python program to demonstrate exception handling.
try:
   num1 = int(input("Enter first number:"))
   num2 =  int(input("Enter second number:"))

   result = num1 / num2

except ZeroDivisionError:
        print("Error: Division by zero is not allowed.")

except ValueError:
      print("Error: Please valid integers.")

else:
      print("Result =" , result)

finally:
      print("Program execution completed.")