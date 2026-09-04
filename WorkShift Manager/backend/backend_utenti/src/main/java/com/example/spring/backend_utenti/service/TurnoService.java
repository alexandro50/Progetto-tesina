package com.example.spring.backend_utenti.service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.spring.backend_utenti.dto.TurnoDTO;
import com.example.spring.backend_utenti.dto.TurnoResponseDTO;
import com.example.spring.backend_utenti.model.Turno;
import com.example.spring.backend_utenti.model.Utente;
import com.example.spring.backend_utenti.repository.TurnoRepository;
import com.example.spring.backend_utenti.repository.UtenteRepository;

@Service
public class TurnoService {

    public static final String NOTA_TIMBRATURA_ATTIVA = "TIMBRATURA_ATTIVA";

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    public TurnoResponseDTO timbraInizio(Long utenteId) {
        Turno attivo = trovaTimbraturaAttiva(utenteId);
        if (attivo != null) {
            throw new RuntimeException("Sei già timbrato in ingresso. Registra prima l'uscita.");
        }

        Utente utente = utenteRepository.findById(utenteId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        LocalDateTime ora = LocalDateTime.now();
        Turno turno = new Turno();
        turno.setUtente(utente);
        turno.setInizioOrario(ora);
        turno.setFineOrario(ora);
        turno.setNote(NOTA_TIMBRATURA_ATTIVA);

        return toResponseDTO(turnoRepository.save(turno));
    }

    public TurnoResponseDTO timbraFine(Long utenteId) {
        Turno attivo = trovaTimbraturaAttiva(utenteId);
        if (attivo == null) {
            throw new RuntimeException("Nessuna timbratura in ingresso attiva.");
        }

        attivo.setFineOrario(LocalDateTime.now());
        attivo.setNote("Timbratura");
        return toResponseDTO(turnoRepository.save(attivo));
    }

    public boolean isTimbraturaAttiva(Long utenteId) {
        return trovaTimbraturaAttiva(utenteId) != null;
    }

    public TurnoResponseDTO getTimbraturaAttivaDTO(Long utenteId) {
        Turno attivo = trovaTimbraturaAttiva(utenteId);
        return attivo == null ? null : toResponseDTO(attivo);
    }

    private Turno trovaTimbraturaAttiva(Long utenteId) {
        List<Turno> attivi = turnoRepository.findByUtenteIdAndNota(utenteId, NOTA_TIMBRATURA_ATTIVA);
        return attivi.isEmpty() ? null : attivi.get(0);
    }

    public TurnoResponseDTO creaTurno(TurnoDTO dto) {
        return creaTurnoPerUtente(dto.getUtenteId(), dto);
    }

    public TurnoResponseDTO creaTurnoPerUtente(Long utenteId, TurnoDTO dto) {        if (dto.getInizioOrario() == null || dto.getFineOrario() == null) {
            throw new IllegalArgumentException("Data e orario di inizio e fine sono obbligatori.");
        }
        if (dto.getInizioOrario().isAfter(dto.getFineOrario())) {
            throw new IllegalArgumentException("L'orario di inizio non può essere successivo a quello di fine.");
        }

        // Verifica anti-sovrapposizione turni (RF-03)
        boolean sovrapposto = turnoRepository.existsTurnoSovrapposto(
                utenteId, dto.getInizioOrario(), dto.getFineOrario());

        if (sovrapposto) {
            throw new RuntimeException("Errore: Il dipendente ha già un turno assegnato in questa fascia oraria.");
        }

        Utente utente = utenteRepository.findById(utenteId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        Turno turno = new Turno();
        turno.setUtente(utente);
        turno.setInizioOrario(dto.getInizioOrario());
        turno.setFineOrario(dto.getFineOrario());
        turno.setNote(dto.getNote());

        return toResponseDTO(turnoRepository.save(turno));
    }

    public List<Turno> getTurniPerUtente(Long utenteId) {
        return turnoRepository.findByUtenteId(utenteId);
    }

    public void eliminaTurnoPerUtente(Long utenteId, Long turnoId) {
        Turno turno = turnoRepository.findById(turnoId)
                .orElseThrow(() -> new RuntimeException("Turno non trovato"));
        if (turno.getUtente() == null || !turno.getUtente().getId().equals(utenteId)) {
            throw new RuntimeException("Non puoi eliminare un turno di un altro dipendente.");
        }
        turnoRepository.deleteById(turnoId);
    }

    public List<Turno> getAllTurni() {
        return turnoRepository.findAll();
    }

    public List<TurnoResponseDTO> getAllTurniDTO() {
        return turnoRepository.findAll().stream()
                .sorted(Comparator.comparing(Turno::getInizioOrario))
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TurnoResponseDTO> getTurniPerUtenteDTO(Long utenteId) {
        return turnoRepository.findByUtenteId(utenteId).stream()
                .sorted(Comparator.comparing(Turno::getInizioOrario))
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private TurnoResponseDTO toResponseDTO(Turno turno) {
        Utente utente = turno.getUtente();
        return new TurnoResponseDTO(
                turno.getId(),
                utente.getId(),
                utente.getNome(),
                utente.getCognome(),
                utente.getEmail(),
                turno.getInizioOrario(),
                turno.getFineOrario(),
                turno.getNote()
        );
    }
}