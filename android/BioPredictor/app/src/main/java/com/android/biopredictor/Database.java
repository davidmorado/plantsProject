package com.android.biopredictor;

import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class Database
{
    private static String loginURL = "https://biopredictor-demo.herokuapp.com/api/user/login";
    private static String getRolesURL = "https://biopredictor-demo.herokuapp.com/api/role/getRoles";
    private static String removeFactorURL = "https://biopredictor-demo.herokuapp.com/api/factor/removeFactor";
    private static String removeCompanyURL = "https://biopredictor-demo.herokuapp.com/api/company/removeCompany";
    private static String addCompanyURL = "https://biopredictor-demo.herokuapp.com/api/company/addCompany";

    public static User login(String Email, String Password)
    {
        try
        {
            HashMap<String, String> postData = new HashMap<>();
            postData.put("email", Email);
            postData.put("password", Password);

            String response = new Server().execute(loginURL, getPostDataString(postData), "POST").get();
            JSONObject jsonobject = new JSONObject(response);

            String name = jsonobject.getString("name");
            String lastName = jsonobject.getString("lastName");
            String email = jsonobject.getString("email");
            return new User(name, lastName, email);

        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static ArrayList<Role> getRoles()
    {
        ArrayList<Role> roles = new ArrayList<>();
        try
        {
            String response = new Server().execute(getRolesURL, "", "GET").get();
            Toast.makeText(ShowRoles.context, response, Toast.LENGTH_SHORT).show();

/*          JSONArray jsonArray = new JSONArray(response);
            if(jsonArray != null && jsonArray.length() > 0)
            {
                JSONObject jsonobject;
                for(int i = 0; i < jsonArray.length(); i++)
                {
                    jsonobject = jsonArray.getJSONObject(i);

                    String name = jsonobject.getString("name");
                    String description = jsonobject.getString("description");
                    roles.add(new Role(name, description));
                }
                return roles;
            }*/
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static int removeFactor(String pId)
    {
        try
        {
            HashMap<String, String> postData = new HashMap<>();
            postData.put("factorId", pId);

            String response = new Server().execute(removeFactorURL, getPostDataString(postData), "POST").get();
            JSONObject jsonobject = new JSONObject(response);

            return jsonobject.getInt("removed");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static int removeCompany(String pId)
    {
        try
        {
            HashMap<String, String> postData = new HashMap<>();
            postData.put("companyId", pId);

            String response = new Server().execute(removeCompanyURL, getPostDataString(postData), "POST").get();
            JSONObject jsonobject = new JSONObject(response);

            return jsonobject.getInt("removed");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static int addCompany(String pName, String pDescription)
    {
        try
        {
            HashMap<String, String> postData = new HashMap<>();
            postData.put("name", pName);
            postData.put("description", pDescription);

            String response = new Server().execute(addCompanyURL, getPostDataString(postData), "POST").get();
            JSONObject jsonobject = new JSONObject(response);

            return jsonobject.getInt("companyId");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return 0;
    }

    private static String getPostDataString(HashMap<String, String> params) throws UnsupportedEncodingException
    {
        StringBuilder result = new StringBuilder();
        boolean first = true;
        for(Map.Entry<String, String> entry : params.entrySet())
        {
            if (first)
                first = false;
            else
                result.append("&");

            result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
            result.append("=");
            result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
        }

        return result.toString();
    }
}
