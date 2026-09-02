package com.example.spring.backend_utenti.dto;

public class JwtResponse {
    private String token;
    private Long id;
    private String email;
    private String nome;
    private String cognome;
    private String ruolo;

    public JwtResponse(String token, Long id, String email, String nome, String cognome, String ruolo) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.cognome = cognome;
        this.ruolo = ruolo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getRuolo() {
        return ruolo;
    }

    public void setRuolo(String ruolo) {
        this.ruolo = ruolo;
    }
}
