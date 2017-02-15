package com.android.biopredictor;

/**
 * Created by Farcem on 15-Sep-16.
 */
public class User
{
    private String _Name;
    private String _LastName;
    private String _Email;

    public User(String _Name, String _LastName, String _Email) {
        this._Name = _Name;
        this._LastName = _LastName;
        this._Email = _Email;
    }

    public String get_LastName() {
        return _LastName;
    }

    public void set_LastName(String _LastName) {
        this._LastName = _LastName;
    }

    public String get_Name() {
        return _Name;
    }

    public void set_Name(String _Name) {
        this._Name = _Name;
    }

    public String get_Email() {
        return _Email;
    }

    public void set_Email(String _Email) {
        this._Email = _Email;
    }
}
