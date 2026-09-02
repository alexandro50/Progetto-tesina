package com.example.spring.backend_utenti.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "turni")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    @Column(nullable = false)
    private LocalDateTime inizioOrario;

    @Column(nullable = false)
    private LocalDateTime fineOrario;

    private String note;

    public Turno() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public LocalDateTime getInizioOrario() {
        return inizioOrario;
    }

    public void setInizioOrario(LocalDateTime inizioOrario) {
        this.inizioOrario = inizioOrario;
    }

    public LocalDateTime getFineOrario() {
        return fineOrario;
    }

    public void setFineOrario(LocalDateTime fineOrario) {
        this.fineOrario = fineOrario;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}