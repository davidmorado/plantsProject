package com.android.biopredictor;

import android.os.AsyncTask;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

public class Server extends AsyncTask<String, String, String> {
    public Server() {
        //set context variables if required
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
    }


    @Override
    protected String doInBackground(String... requestURL) {
        URL url;
        String response = "";
        try
        {
            if (requestURL[2].equals("POST")) {
                url = new URL(requestURL[0]);

                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setReadTimeout(15000);
                conn.setConnectTimeout(15000);
                conn.setRequestMethod(requestURL[2]);
                conn.setDoInput(true);
                conn.setDoOutput(true);

                OutputStream os = conn.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
                writer.write(requestURL[1]);

                writer.flush();
                writer.close();
                os.close();

                int responseCode = conn.getResponseCode();

                if (responseCode == HttpsURLConnection.HTTP_OK) {
                    String line;
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    while ((line = br.readLine()) != null) {
                        response += line;
                    }
                } else {
                    String line;
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
                    while ((line = br.readLine()) != null) {
                        response += line;
                    }
                }
            } else {
                InputStream in = new URL(requestURL[0]).openStream();
                String line;
                BufferedReader br = new BufferedReader(new InputStreamReader(in));
                while ((line = br.readLine()) != null) {
                    response += line;
                }
            }
        } catch (final Exception e) {
            MainActivity.activity.runOnUiThread(new Runnable() {
                public void run() {
                    Toast.makeText(MainActivity.context, e.toString(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        return response;
    }
}