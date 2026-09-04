package com.example.spring.backend_utenti.dto;

import java.time.LocalDateTime;

public class TurnoResponseDTO {
    private Long id;
    private Long utenteId;
    private String nome;
    private String cognome;
    private String email;
    private LocalDateTime inizioOrario;
    private LocalDateTime fineOrario;
    private String note;

    public TurnoResponseDTO() {
    }

    public TurnoResponseDTO(Long id, Long utenteId, String nome, String cognome, String email,
                            LocalDateTime inizioOrario, LocalDateTime fineOrario, String note) {
        this.id = id;
        this.utenteId = utenteId;
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.inizioOrario = inizioOrario;
        this.fineOrario = fineOrario;
        this.note = note;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUtenteId() { return utenteId; }
    public void setUtenteId(Long utenteId) { this.utenteId = utenteId; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCognome() { return cognome; }
    public void setCognome(String cognome) { this.cognome = cognome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getInizioOrario() { return inizioOrario; }
    public void setInizioOrario(LocalDateTime inizioOrario) { this.inizioOrario = inizioOrario; }
    public LocalDateTime getFineOrario() { return fineOrario; }
    public void setFineOrario(LocalDateTime fineOrario) { this.fineOrario = fineOrario; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
