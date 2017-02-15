package com.android.biopredictor;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity
{
    public static Context context;
    public static Activity activity;
    EditText emailText;
    EditText passwordText;
    Button loginButton;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        context = this;
        activity = this;

        emailText = (EditText)findViewById(R.id.emailText);
        passwordText = (EditText)findViewById(R.id.passwordText);
        loginButton = (Button)findViewById(R.id.loginButton);
    }

    public void login(View view)
    {
        String email = emailText.getText().toString();
        String password = passwordText.getText().toString();

        if(!email.isEmpty() && !password.isEmpty())
        {
            User user = Database.login(email, password);
            if (user != null) {
                Toast.makeText(MainActivity.this, user.get_Name() + " " + user.get_LastName() + " has login.", Toast.LENGTH_LONG).show();
                Intent intent = new Intent(this, Menu.class);
                startActivity(intent);
            } else
                Toast.makeText(MainActivity.this, "User not found or login error.", Toast.LENGTH_LONG).show();
        }
        else
            Toast.makeText(MainActivity.this, "Enter the email and password.", Toast.LENGTH_LONG).show();
    }
}
