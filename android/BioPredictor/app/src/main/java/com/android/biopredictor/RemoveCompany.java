package com.android.biopredictor;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class RemoveCompany extends AppCompatActivity
{
    EditText companyIdText;
    Button removeButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_remove_company);

        companyIdText = (EditText) findViewById(R.id.companyIdText);
        removeButton = (Button) findViewById(R.id.removeButton);
    }

    public void removeButton(View view)
    {
        String userId = companyIdText.getText().toString();
        if(!userId.isEmpty())
        {
            int result = Database.removeCompany(userId);
            if (result == 1)
                Toast.makeText(this, "Company with id: " + userId + " has been removed.", Toast.LENGTH_LONG).show();
            else
                Toast.makeText(this, "Company with id: " + userId + " couldn't be removed.", Toast.LENGTH_LONG).show();
        }
        else
            Toast.makeText(this, "Enter company id.", Toast.LENGTH_LONG).show();
    }
}
