package com.example.spring.backend_utenti.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "utenti")
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nome;
    private String cognome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Ruolo ruolo;

    private LocalDate dataAssunzione;

    private Double tariffaOraria;

    public Utente() {
    }

    public Utente(String email, String password, String nome, String cognome, Ruolo ruolo) {
        this.email = email;
        this.password = password;
        this.nome = nome;
        this.cognome = cognome;
        this.ruolo = ruolo;
    }

    // Getter e Setter
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Ruolo getRuolo() {
        return ruolo;
    }

    public void setRuolo(Ruolo ruolo) {
        this.ruolo = ruolo;
    }

    public LocalDate getDataAssunzione() {
        return dataAssunzione;
    }

    public void setDataAssunzione(LocalDate dataAssunzione) {
        this.dataAssunzione = dataAssunzione;
    }

    public Double getTariffaOraria() {
        return tariffaOraria;
    }

    public void setTariffaOraria(Double tariffaOraria) {
        this.tariffaOraria = tariffaOraria;
    }
}
