package com.android.biopredictor;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class Menu extends AppCompatActivity
{
    Button addCompanyButton;
    Button removeFactorButton;
    Button removeCompanyButton;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        addCompanyButton = (Button)findViewById(R.id.addCompanyButton);
        removeCompanyButton = (Button)findViewById(R.id.removeCompanyButton);
        removeFactorButton = (Button)findViewById(R.id.removeFactorButton);
    }

    public void addCompanyButton(View view)
    {
        Intent intent = new Intent(this, AddCompany.class);
        startActivity(intent);
    }

    public void removeFactorButton(View view)
    {
        Intent intent = new Intent(this, RemoveFactor.class);
        startActivity(intent);
    }

    public void removeCompanyButton(View view)
    {
        Intent intent = new Intent(this, RemoveCompany.class);
        startActivity(intent);
    }
}
