package com.android.biopredictor;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;

import java.util.ArrayList;

public class ShowRoles extends AppCompatActivity
{
    TextView rolesText;
    public static Context context;
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_roles);
        context = this;

        rolesText = (TextView)findViewById(R.id.rolesText);

        String rolesString = "";
        ArrayList<Role> roles = Database.getRoles();
        /*
        for(Role role : roles)
        {
            rolesString += role.toString();
        }
        rolesText.setText(rolesString);
        */
    }
}
