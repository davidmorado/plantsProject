package com.android.biopredictor;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class RemoveFactor extends AppCompatActivity
{
    EditText factorIdText;
    Button removeButton;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_remove_factor);

        factorIdText = (EditText) findViewById(R.id.companyIdText);
        removeButton = (Button) findViewById(R.id.removeButton);
    }

    public void removeButton(View view)
    {
        String userId = factorIdText.getText().toString();
        if(!userId.isEmpty())
        {
            int result = Database.removeFactor(userId);
            if (result == 1)
                Toast.makeText(RemoveFactor.this, "Factor with id: " + userId + " has been removed.", Toast.LENGTH_LONG).show();
            else
                Toast.makeText(RemoveFactor.this, "Factor with id: " + userId + " couldn't be removed.", Toast.LENGTH_LONG).show();
        }
        else
            Toast.makeText(RemoveFactor.this, "Enter factor id.", Toast.LENGTH_LONG).show();
    }
}
