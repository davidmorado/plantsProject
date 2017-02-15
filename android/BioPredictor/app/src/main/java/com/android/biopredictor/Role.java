package com.android.biopredictor;

/**
 * Created by Farcem on 15-Sep-16.
 */
public class Role
{
    private String _Name;
    private String _Description;

    public Role(String _Name, String _Description) {

        this._Name = _Name;
        this._Description = _Description;
    }

    public String get_Name() {
        return _Name;
    }

    public void set_Name(String _Name) {
        this._Name = _Name;
    }

    public String get_Description() {
        return _Description;
    }

    public void set_Description(String _Description) {
        this._Description = _Description;
    }

    public String toString()
    {
        return this._Name + " " + this._Description + "\n";
    }
}
