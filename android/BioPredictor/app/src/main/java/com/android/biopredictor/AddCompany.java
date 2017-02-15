package com.android.biopredictor;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class AddCompany extends AppCompatActivity
{
    Button addCompanyButton;
    EditText descriptionText;
    EditText nameText;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_company);

        addCompanyButton = (Button)findViewById(R.id.addCompanyButton);
        descriptionText = (EditText) findViewById(R.id.descriptionText);
        nameText = (EditText) findViewById(R.id.nameText);
    }

    public void addCompany(View view)
    {
        String name = nameText.getText().toString();
        String description = descriptionText.getText().toString();

        if(!name.isEmpty() && !description.isEmpty())
        {
            int companyId = Database.addCompany(name, description);

            if(companyId != 0)
                Toast.makeText(AddCompany.this, "The company has been added,", Toast.LENGTH_SHORT).show();
            else
                Toast.makeText(AddCompany.this, "The company has not been added.", Toast.LENGTH_SHORT).show();
        }
        else
            Toast.makeText(AddCompany.this, "Enter name and description.", Toast.LENGTH_SHORT).show();
    }
}
